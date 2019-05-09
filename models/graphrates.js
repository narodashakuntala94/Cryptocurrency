var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var marketSchema = new Schema({
    //id: Number,
    name: String,
    symbol: String,
    percentChange24h: Number,
    buyingPriceEth: Number,
    buyingPriceUsd: Number,
    buyingPriceInr: Number,
    buyingPriceCcd: Number,
    buyingPriceBtc: Number,
    sellingPriceEth: Number,
    sellingPriceUsd: Number,
    sellingPriceInr: Number,
    sellingPriceCcd: Number,
    sellingPriceBtc: Number,
    contBuyingPriceEth: Number,
    contBuyingPriceUsd: Number,
    contBuyingPriceInr: Number,
    contBuyingPriceCcd: Number,
    contBuyingPriceBtc: Number,
    contSellingPriceEth: Number,
    contSellingPriceUsd: Number,
    contSellingPriceInr: Number,
    contSellingPriceCcd: Number,
    contSellingPriceBtc: Number,
    img: String,
    updatedAt: String,
    createdAt: String,
});
var coinMarketObj = mongoose.model('graphRates', marketSchema);
module.exports = coinMarketObj;