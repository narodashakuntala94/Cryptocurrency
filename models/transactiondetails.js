var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var transactionSchema = new Schema({
    userId: {
        type: String
    },
    symbol: {
        type: String
    },
    amount: {
        type: String
    },
    paymentProviderId: {
        type: String
    },
    currencyType: {
        type: String
    },
    transactionId: {
        type: String,
        unique: true
    },
    refTransactionId: {
        type: String,
    },
    fees: {
        type: String
    },
    contractTime: {
        type: String
    },
    contractEndTime: {
        type: String
    },
    updatedAt: {
        type: String
    },
    quantity: {
        type: String
    },
    buyFromQuantity: {
        type: String
    },
    dealType: {
        type: String
    },
    currentRate: {
        type: String
    },
    createdAt: {
        type: String
    },
    buyFrom: {
        type: String
    },
    recipientAddress: {
        type: String
    },
    senderAddress: {
        type: String
    },
    type: {
        type: String
    },
    buySellRate: {
        type: String
    },
    margin: {
        type: String
    },
    limitlevel: {
        type: String
    },
    stopLoss: {
        type: String
    },
    stoplossAmt: {
        type: String
    },
    stopLossRate: {
        type: String
    },
    stopLossPercentage: {
        type: String
    },
    stopProfit: {
        type: String
    },
    stopProfitAmt: {
        type: String
    },
    stopProfitRate: {
        type: String
    },
    stopProfitPercentage: {
        type: String
    },
    bitgoTransactionId: {
        type: String
    },
    bitgoTransaction: {
        type: String
    },
    bitgoTransactionStatus: {
        type: String
    },
    receiverUserId: {
        type: String
    },
    transactionStatus: {
        type: String
    },
    recipientEmail: {
        type: String
    },
    finalAmount: {
        type: String
    },
    name: {
        type: String
    },
    img: {
        type: String
    },
    profitOrLoss: {
        type: String
    },
    limitStatus: {
        type: String
    },
    limitRate: {
        type: String
    },
    link: {
        type: String
    },
});

var transactionDetailObj = mongoose.model('transactiondetails', transactionSchema);

module.exports = transactionDetailObj;