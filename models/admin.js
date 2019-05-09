var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var adminSchema = new Schema({
    symbol: {
        type: String,
        unique: true,
    },
    buyRate: {
        type: Number
    },
    sellRate: {
        type: Number
    },
    contractBuyRate: {
        type: Number
    },
    contractSellRate: {
        type: Number
    },
    gst: {
        type: Number
    },
    fees: {
        type: Number
    },
    margin: {
        type: Number
    },
    minimumQuantity: {
        type: Number
    },
    adminUserId:{
        type: String,
    },
    password: {
        type: String
    },
    sessionId: {
        type: String
    },
});
var adminObj = mongoose.model('admin', adminSchema);

module.exports = adminObj;