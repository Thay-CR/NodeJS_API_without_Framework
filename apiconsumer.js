var axios = require('axios');

const api ={
    allCryptos: async () => {
        const result = await axios.get(`https://api-testnet.bybit.com/v2/public/tickers`)
        const arrayresponse = result.data.result
        const newArray = arrayresponse.slice(0, 5);
        return newArray
    }
}

module.exports = api
