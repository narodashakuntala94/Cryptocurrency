var Models = require('../models');
var saveDetails = (objToSave, callback) =>{
    Models.coinDetails.insertMany(objToSave, callback);
};
var fetchDataTimestamp = (criteria, datatoshow, options, callback) =>{
    Models.coinDetails.find(criteria, {
        _id: 0,
        __v: 0
    }, {}, callback)
};
////////////////////created for dummy insertion in admin table OR to create admin table////////////

//////View all details in coinmarket collection ///////
var viewData = (callback) =>{
    Models.coinDetails.find({}, {
        _id: 0,
        __v: 0
    }, {}, callback).explain("executionStats");
};

module.exports = {
    saveDetails: saveDetails,
    fetchDataTimestamp: fetchDataTimestamp,
    viewData: viewData,
  
}