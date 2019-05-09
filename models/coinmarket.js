var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var marketSchema = new Schema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    symbol: {
        type: String
    },
    rank: {
        type: String
    },
    price_usd: {
        type: String
    },
    price_inr: {
        type: String
    },
    price_btc: {
        type: String
    },
    price_eth: {
        type: String
    },
    sellrate_ETH: {
        type: String
    },
    sellrate_BTC: {
        type: String
    },
    timestamp: {
        type: Date
    },
    sellrate_INR: {
        type: String
    },
    sellrate_USD: {
        type: String
    },
    '24h_volume_usd': {
        type: String
    },
    market_cap_usd: {
        type: String
    },
    available_supply: {
        type: String
    },
    max_supply: {
        type: String
    },
    total_supply: {
        type: String
    },
    percent_change_1h: {
        type: String
    },
    percent_change_24h: {
        type: String
    },
    percent_change_7d: {
        type: String
    },
    last_updated: {
        type: String
    },
    img: {
        type: String
    },
    fees: {
        type: String,
    },
    gst: {
        type: String,
    },
    difference: {
        type: String,
    },
});

var coinMarketObj = mongoose.model('coinmarket', marketSchema);

module.exports = coinMarketObj;