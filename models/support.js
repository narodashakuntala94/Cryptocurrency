var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var supportSchema = new Schema({
    userId: {
        type: String
    },
    subject: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String
    },
    createdAt: {
        type: String
    },
    emailId: {
        type: String
    },
    closedAt: {
        type: String
    }
});
var supportObj = mongoose.model('support', supportSchema);

module.exports = supportObj;