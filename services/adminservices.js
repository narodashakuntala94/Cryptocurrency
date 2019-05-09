var Models = require('../models');
var saveAdminData = (objToSave, callback) => {
    new Models.admin(objToSave).save(callback);
};
var fetchAdminData = callback => {
    Models.admin.find({}, {
        _id: 0,
        __v: 0
    }, {}, callback);
}
var fetchOne = (criteria, datatoshow, options, callback) => {
    Models.admin.findOne(criteria, {
        _id: 0,
        __v: 0
    }, {}, callback)
};
var updateAdminData = (criteria, dataToSet, options, callback) => {
    Models.admin.findOneAndUpdate(criteria, dataToSet, options, callback);
};
module.exports = {
    saveAdminData: saveAdminData,
    fetchAdminData: fetchAdminData,
    fetchOne: fetchOne,
    updateAdminData:updateAdminData,
}