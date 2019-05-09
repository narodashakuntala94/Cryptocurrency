var Models = require('../models');
var fetchTransaction =  (criteria, projection, options, callback) =>{
    Models.transactiondetails.find(criteria, projection, {}, callback).sort({
        $natural: -1
    });
}
var updateTransaction =  (criteria, dataToSet, options, callback) =>{
    Models.transactiondetails.update(criteria, dataToSet, {}, callback);
}
var saveTransactionDetail =  (objToSave, callback) =>{
    new Models.transactiondetails(objToSave).save(callback);
}
module.exports = {
    fetchTransaction: fetchTransaction,
    saveTransactionDetail: saveTransactionDetail,
    updateTransaction: updateTransaction,
}