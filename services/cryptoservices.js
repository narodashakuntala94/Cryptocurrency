var Models = require('../models');

var updateCryptoRates = (criteria, dataToSet, options, callback) => {
    Models.cryptoRates.findOneAndUpdate(criteria, dataToSet, options, callback);
};
var fetchGraphData = (criteria, dataToSet, options, callback) => {
    Models.graphRates.find(criteria, {
        _id: 0,
        __v: 0
    }, {}, callback);
}
var saveCryptoRates = (objToSave, callback) => {
    Models.cryptoRates.insertMany(objToSave, callback);
};
var saveGraphRates = (objToSave, callback) => {
    Models.graphRates.insertMany(objToSave, callback);
};
var fetchUpdatedCryptoRates = callback => {
    Models.cryptoRates.find({}, {
        _id: 0,
        __v: 0
    }, {}, callback);
}
var fetchOneCryptoData = (criteria, dataToSet, options, callback) => {
    Models.cryptoRates.findOne(criteria, {
        _id: 0,
        __v: 0
    }, {}, callback);
}
var fetchOneData = (criteria, dataToSet, options, callback) => {
    Models.cryptoRates.find(criteria, {
        _id: 0,
        __v: 0
    }, {}, callback);
}
module.exports = {
    updateCryptoRates: updateCryptoRates,
    fetchGraphData: fetchGraphData,
    saveCryptoRates: saveCryptoRates,
    saveGraphRates: saveGraphRates,
    fetchUpdatedCryptoRates: fetchUpdatedCryptoRates,
    fetchOneCryptoData: fetchOneCryptoData,
    fetchOneData: fetchOneData
}