var Service = require('../services');
//// for Saving Admin Data////////////////
const saveAdminData = (data, callback) => {
    console.log(data, 'data+++++===========');
    Service.adminServices.saveAdminData(data, (err, newData) => {
        console.log(err, newData);
        if (err) {
            if (err.code && err.code == 11000) {
                return callback(err.message);
            }
            return callback(err);
        } else {
            console.log("HERE=============+===============");
            return callback(null, newData);
        }
    })
}
//////////// for fetching all Data in Admin table///////////////
const viewAdminData = (callback) => {
    Service.adminServices.fetchAdminData((err, newData) => {
        if (err) {
            if (err.code && err.code == 11000) {
                return callback(err.message);
            }
            return callback(err);
        } else {
            console.log("++++viewBlog HERE++++");
            return callback(null, newData);
        }
    })
}
const editAdminData = (data, callback) => {
    var criteria = {
        symbol: data.symbol,
    };
    //     if (data.sellRate) {
    //         var dataToUpdate = {
    //             sellRate: data.sellRate,
    //         };
    //     } else if (data.gst) {
    //         var dataToUpdate = {
    //             gst: data.gst,
    //         };
    //     } else if (data.buyRate) {
    //         var dataToUpdate = {
    //             buyRate: data.buyRate,
    //         };
    //     } else if (data.fees) {
    //         var dataToUpdate = {
    //             fees: data.fees,
    //         };
    //     } else if (data.margin) {
    //         var dataToUpdate = {
    //             margin: data.margin,
    //         };
    //     } else if (data.contractBuyRate) {
    //         var dataToUpdate = {
    //             contractBuyRate: data.contractBuyRate,
    //         };
    //     } else if (data.contractSellRate) {
    //         var dataToUpdate = {
    //             contractSellRate: data.contractSellRate,
    //         };
    // }
    // else {
    var dataToUpdate = {
        sellRate: data.sellRate,
        gst: data.gst,
        buyRate: data.buyRate,
        fees: data.fees,
        margin: data.margin,
        contractBuyRate: data.contractBuyRate,
        contractSellRate: data.contractSellRate,
        minimumQuantity: data.minimumQuantity,
    };
    Service.adminServices.updateAdminData(criteria, dataToUpdate, {}, (err, newData) => {
        if (err) {
            if (err.code && err.code == 11000) {
                return callback(err.message);
            }
            return callback(err);
        } else {
            console.log("++++viewBlog HERE++++");
            return callback(null, newData);
        }
    })
}
//////////////// for fetching particular one currency on the basis of symbol from admin collection/////////
const fetchOne = (data, callback) => {
    var criteria = {
        symbol: data.symbol
    };
    Service.adminServices.fetchOne(criteria, {}, {}, (err, newData) => {
        if (err) {
            if (err.code && err.code == 11000) {
                return callback(err.message);
            }
            return callback(err);
        } else {
            console.log("++++viewBlog HERE++++");
            return callback(null, newData);
        }
    })
}
const adminSignUp = (data, callback) => {
    var criteria = {
        emailId: data.emailId,
        firstName: data.firstName,
        lastName: data.lastName,
        password: encryptedPassword(data.password),
        mobileNumber: data.mobileNumber,
        /////random number for userID /////////////////////
        userId: Math.random().toString(36).substr(2, 16),
        createdAt: new Date().toISOString(),
        registerFrom: "MOBILE",
    }
    var checkEmailOrMobile = {
        emailId: data.emailId
    }
    Service.userServices.fetchOne(checkEmailOrMobile, {}, {}, (err, userData) => {
        if (err) {
            return err.message;
        } else {
            if (userData.length > 0) {
                return callback({
                    "MESSAGE": "EmailId Already Exists As A User Email"
                });
            } else {
                Service.userServices.saveUserDetail(criteria, (err, newData) => {
                    if (err) {
                        if (err.code && err.code == 11000) {
                            return callback(err.message);
                        }
                        return callback(err);
                    } else {
                        return callback(null, newData);
                    }
                })
            }
        }
    })
}
module.exports = {
    viewAdminData: viewAdminData,
    saveAdminData: saveAdminData,
    fetchOne: fetchOne,
    editAdminData: editAdminData,
}