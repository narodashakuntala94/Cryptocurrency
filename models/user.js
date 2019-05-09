var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var userSchema = new Schema({
    emailId: {
        type: String,
        unique: true
    },
    userId: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    sessionId: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    address: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String,
    },
    city: {
        type: String
    },
    pincode: {
        type: String
    },
    bankDetails: {
        bankName: {
            type: String
        },
        accountNumber: {
            type: String
        },
        ifsc: {
            type: String,
        },
        branch: {
            type: String
        },
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: String
    },
    createdAt:{
        type: String
    },
    registerFrom:{
        type: String
    },
    google_auth:{
        type: String
    },

    gAuthKey:{
        type: String
    },

    antiPhishing:{
        type: String
    },

    antiPhishKey:{
        type: String
    },

    sms_auth:{
        type: String
    },
    sms_authKey:{
        type: String
    }

});
var userObj = mongoose.model('userdetails', userSchema);

module.exports = userObj;