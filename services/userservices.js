var Models = require('../models');
var fetchOne =  (criteria,projection, options, callback) =>{
    Models.user.find(criteria,projection, options, callback).sort({
        $natural: -1
    });
}
var saveUserDetail = (objToSave, callback) =>{
    new Models.user(objToSave).save(callback);
}
var updateUserDetail = (criteria, dataToSet, options, callback) =>{
    Models.user.update(criteria, dataToSet, options, callback);
}
module.exports = {
    fetchOne: fetchOne,
    saveUserDetail: saveUserDetail,
    updateUserDetail: updateUserDetail,
}