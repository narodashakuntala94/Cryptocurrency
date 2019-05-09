var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var favouriteSchema = new Schema({
    symbol: {
        type: String
    },
    userId: {
        type: String
    },
    exchangeCurrencyFrom: {
        type: String
    },
    percent_change_24h: {
        type: String
    },
    volume24h: {
        type: Number
    },
    price: {
        type: Number
    },
    createdAt: {
        type: String
    },
    isFavourite: {
        type: Boolean
    },
    img: {
        type: String
    }
});
var favouriteObj = mongoose.model('favourites', favouriteSchema);

module.exports = favouriteObj;