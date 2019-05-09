var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var conversionSchema = new Schema({
    timestamp: {
        type: String
    },
    base: {
        type: String
    },
    rates: {
        type: {
            INR: {
                type: String
            },
            BTC: {
                type: String
            },
        }
    },
});
var conversionObj = mongoose.model('conversion', conversionSchema);

module.exports = conversionObj;