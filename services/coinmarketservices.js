var Models = require('../models');
///////Save details in coindetails collection for graph /////////

var update = (criteria, dataToSet, options, callback) => {
    Models.coinMarket.findOneAndUpdate(criteria, dataToSet, options, callback);
};
var fetchDetails = callback => {
    Models.coinMarket.find({}, {
        _id: 0,
        __v: 0
    }, {}, callback);
}
var fetchOneCurrency = (criteria, dataToSet, options, callback) => {
    Models.coinMarket.findOne(criteria, {
        _id: 0,
        __v: 0
    }, {}, callback);
}
var saveFavourite = (objToSave, callback) => {
    new Models.favourites(objToSave).save(callback);
}
var fetchFavourite = (criteria, dataToSet, options, callback) => {
    Models.favourites.find(criteria, {
        _id: 0,
        __v: 0
    }, {}, callback);
}
var deleteFavourite = (criteria, callback) => {
    Models.favourites.deleteOne(criteria, callback);
}
module.exports = {
    fetchDetails: fetchDetails,
    update: update,
    fetchOneCurrency: fetchOneCurrency,
    saveFavourite: saveFavourite,
    fetchFavourite: fetchFavourite,
    deleteFavourite: deleteFavourite,
}