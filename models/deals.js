var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dealSchema = new Schema({
    userId: {
        type: String
    },
    amount: {
        type: String
    },
    fees: {
        type: String
    },
    quantity: {
        type: String
    },
    exchangeCurrencyFrom: {
        type: String
    },
    exchangeCurrencyTo: {
        type: String
    },
    transactionType: {
        type: String
    },
    buySellRate: {
        type: String
    },
    margin: {
        type: String
    },
    limitRate: {
        type: String
    },
    stopLossRate: {
        type: String
    },
    stopLossPercentage: {
        type: String
    },
    stopProfitAmt: {
        type: String
    },
    stopProfitRate: {
        type: String
    },
    transactionStatus: {
        type: String
    },
    name: {
        type: String
    },
    profitOrLoss: {
        type: String
    },
    limitStatus: {
        type: String
    },
    stopProfitStatus: {
        type: String
    },
    stopLossStatus: {
        type: String
    }

});

var dealObj = mongoose.model('deals', dealSchema);

module.exports = dealObj;