var URL = {
"liveRateURL" : 'https://api.coinmarketcap.com/v1/ticker/',
"conversionURL" : "https://openexchangerates.org/api/latest.json?app_id=4575ea3df50a45bab995a73492209404",
"coincapURL":"https://api.coinmarketcap.com/v2/ticker/",
"hitbtcURL":"https://api.hitbtc.com/api/2/public/candles/",
}
 var serverPath = "13.59.222.160:3000";
//var serverPath = "192.168.1.11:3000";
// var serverPath = "nitxyz.coincode.in";
//var serverPath = "127.0.0.1:3000";
module.exports = {
    URL :URL,
    ServerPath : serverPath
}