var Models = require('../models');
var updateWalletDetails =  (criteria, projection, callback) =>{
    Models.wallet.updateOne(criteria, projection,{strict: false}, callback);
};
var saveWalletDetails =  (criteria, callback) =>{
    Models.wallet.insertMany(criteria, callback);
};
var fetchWalletDetails =  (criteria,projection, callback) =>{
    Models.wallet.find(criteria, projection, callback);
};
module.exports = {
    saveWalletDetails: saveWalletDetails,
    fetchWalletDetails: fetchWalletDetails,
    updateWalletDetails: updateWalletDetails,
}