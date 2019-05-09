var Models = require('../models');
var saveTicket = (objToSave, callback) =>{
    new Models.support(objToSave).save(callback);
}
var viewTicket = callback => {
    Models.support.find({}, {
        __v: 0
    }, {}, callback);
}
var findTicket =  (criteria,projection, options, callback) =>{
    Models.support.find(criteria,projection, options, callback).sort({
        $natural: -1
    });
}
module.exports = {
    saveTicket: saveTicket,
    viewTicket:viewTicket,
    findTicket:findTicket
}