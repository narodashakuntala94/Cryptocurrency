var Models = require('../models');
var fetchDeal =  (criteria, callback) =>{
    Models.deals.find(criteria, {
        _id: 0,
        __v: 0
    }, {}, callback).sort({
        $natural: -1
    });
}
var saveDeal =  (objToSave, callback) =>{
    new Models.deals(objToSave).save(callback);
}
module.exports = {
    fetchDeal: fetchDeal,
    saveDeal: saveDeal,
}