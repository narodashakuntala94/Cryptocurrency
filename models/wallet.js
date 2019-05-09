var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var walletSchema = new Schema({
    userId: {
        type: String,
        unique: true,
    },
    wallet:[{
        symbol:{
            type: String,
        },
        name:{
            type: String,
        },
        privateAddress: {
            type: String,
        },
        paymentProviderId: {
            type: String
        },
        privateKey: {
            type: String
        },
        publicAddress: {
            type: String,
        },
        fees: {
            type: String,
        },
        walletId: {
            type: String,
        },
        minBalance: {
            type: Number,
        },
        balance: {
            type: Number,
        },
        onOrdersBalance: {
            type: Number,
        },
        sType: {
            type: String
        },
        sINRBalance: {
            type: Number
        },
        sETHBalance: {
            type: Number
        },
        sBTCBalance: {
            type: Number
        },
        sUSDBalance: {
            type: Number
        },
        sMargin: {
            type: Number
        },
        sProfitLoss: {
            type: String
        },
        sCryptoImage: {
            type: String
        },
    }]
});
var walletObj = mongoose.model('wallet', walletSchema);
walletSchema.plugin(uniqueValidator);
module.exports = walletObj;