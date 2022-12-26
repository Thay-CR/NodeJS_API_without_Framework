const http = require('http')
const { randomUUID } = require('crypto')
const api= require('./apiconsumer')

var myArray = []
var idCount = 0

api.allCryptos().then((data)=> {
    myArray = data.sort(function(a, b) {
        let obj1 = a
        let obj2 = b
        let price1 = parseFloat(obj1.last_price)
        let price2 = parseFloat(obj2.last_price)
            if(price1 > price2) {
            return -1;
            } else {
            return true;
            }
      });
     myArray = myArray.map(function(element){
        return { 
            symbol: `${element.symbol}`,
            last_price: `${element.last_price}`,
            next_funding_time: `${element.next_funding_time}`
         }
      })
      myArray = myArray.map(function(data) {
        return {
          ...data,
          id: idCount += 1
        }
      })
})

const server = http.createServer((req, res)=>{

    if(req.url === "/cryptos"){
        if(req.method === "GET"){
            res.end(JSON.stringify(myArray))
        }
        if(req.method === "POST"){
            req.on('data', (data)=> {
                const newData = JSON.parse(data)
                const crypto = {
                    id: randomUUID(),
                    ...newData
                }
                myArray.push(crypto)
            }).on('end', ()=>{
                res.end(JSON.stringify(myArray))
            })
        }
    }

    if(req.url.startsWith('/cryptos')){
        if(req.method === "PUT"){

            const url = req.url
            const splitUrl = url.split("/")
            let idCrypto = splitUrl[2]
            const cryptoIndex = myArray.findIndex(item => item.id === idCrypto)

            req.on('data', (data)=>{
                const cryp = JSON.parse(data)
                myArray[cryptoIndex] = {
                    id : idCrypto,
                    ...cryp
                }
               
            }).on('end', () =>{
                res.end(JSON.stringify(myArray))
            })

        }
        if(req.method === "DELETE"){
            const url = req.url
            const splitUrl = url.split("/")
            let idCrypto = splitUrl[2]
            let newArray = [...myArray]
            myArray = newArray.filter((item) =>
              item.id != idCrypto
            );
            res.end(JSON.stringify(myArray))
        }
    }
})

server.listen(4000, ()=> console.log("server is running!"))