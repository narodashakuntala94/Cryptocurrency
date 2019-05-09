var Service = require('../services');
var userTable = require('../models/user')
var bcrypt = require('bcrypt');
/////function to make password encrypted////////
const encryptedPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};
/////function to check if password is valid or not////////
const isPasswordValid = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}
///////for signing up on the basis of few parameters////////////
const signUp = (data, callback) => {
    if (data.registerFrom) {
        var criteria = {
            emailId: data.emailId,
            firstName: data.firstName,
            lastName: data.lastName,
            password: encryptedPassword(data.password),
            mobileNumber: data.mobileNumber,
            /////random number for userID /////////////////////
            userId: Math.random().toString(36).substr(2, 16),
            createdAt: new Date().toISOString(),
            // registerFrom: data.registerFrom,
            google_auth: "",
            gAuthKey: "",
            antiPhishing:"",
            antiPhishKey:"",
            sms_auth:"",
            registerFrom: data.registerFrom,
        }
    } else {
        var criteria = {
            emailId: data.emailId,
            firstName: data.firstName,
            lastName: data.lastName,
            password: encryptedPassword(data.password),
            mobileNumber: data.mobileNumber,
            /////random number for userID /////////////////////
            userId: Math.random().toString(36).substr(2, 16),
            createdAt: new Date().toISOString(),
            google_auth: "",
            gAuthKey: "",
            antiPhishing: "",
            antiPhishKey:"",
            sms_auth:"",
            registerFrom: "MOBILE",
        }
    }
    var checkEmailOrMobile = {
        $or: [{
            emailId: data.emailId
        }, {
            mobileNumber: data.mobileNumber
        }]
    }
    Service.userServices.fetchOne(checkEmailOrMobile, {}, {}, (err, userData) => {
        if (err) {
            return err.message;
        } else {
            if (userData.length > 0) {
                if(userData[0].emailId==criteria.emailId)
                {
                    return callback({
                        "MESSAGE": "EmailId Already Exists"
                    });
                }
                else if(userData[0].mobileNumber==criteria.mobileNumber)
                {
                    return callback({
                        "MESSAGE": "Mobile Number Already Exists"
                    });
                }
                
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

///////Currently not in use for project//////////////////
// const countryList = (callback) => {
//     var country = require('countryjs');
//     var all = country.all();
//     return callback(all)
// }
// const cityList = (data, callback) => {
//     const cities = require("all-the-cities")
//     var cityName = cities.filter(city => {
//         return city.name.match(data.stateName)
//     })
//     console.log(cityName, "CITYNAME");
//     return callback(null, cityName)
// }

//// To check weather the user is logged in or not on the basis of userId and sessionId////////////////
const isLoggedIn = (data, callback) => {
    var checkSessionId = {
        emailId: data.emailId,
        sessionId: data.sessionId,
    };
    Service.userServices.fetchOne(checkSessionId, {}, {}, (err, userData) => {
        if (err) {
            return err.message;
        } else {
            if (userData.length > 0) {
                return callback(null, {
                    "MESSAGE": "VALID USER with ACTIVE SESSION"
                });
            } else {
                return callback(null, {
                    "MESSAGE": "SESSION EXPIRED"
                })
            }
        }
    })

}
///////To validate OTP on the basis of mailId and OTP and also to check the expiry of OTP////////////
const validateOtp = (data, callback) => {
    var checkOtp = {
        emailId: data.emailId,
        resetPasswordToken: data.otp,
    };
    Service.userServices.fetchOne(checkOtp, {}, {}, (err, userData) => {
        if (err) {
            return err.message;
        } else {
            if (userData.length == 0) {
                return callback({
                    "MESSAGE": "Invalid OTP"
                })
            } else {
                //console.log(userData, userData[0].resetPasswordToken, data.otp, "otp------");
                if (userData[0].resetPasswordToken == data.otp) {
                    var currentTime = new Date();
                    if (userData[0].resetPasswordExpires >= currentTime) {
                        return callback(null, {
                            "MESSAGE": "Valid OTP"
                        });
                    } else {
                        return callback({
                            "MESSAGE": "TOKEN EXPIRED"
                        })
                    }
                } else {
                    return callback({
                        "MESSAGE": "Invalid OTP"
                    })
                }
            }
        }
    })
}
/////////////////To edit the profile of user for adding address part//////////////////
const editProfile = (data, callback) => {
    var checkUser = {
        emailId: data.emailId,
        sessionId: data.sessionId,
    }
    var dataToSet = {
        address: data.address,
        country: data.country,
        state: data.state,
        city: data.city,
        pincode: data.pincode
    }
    Service.userServices.fetchOne(checkUser, {}, {}, (err, userData) => {
        if (err) {
            return err.message;
        } else {
            if (userData.length == 0) {
                console.log("Invalid Email or session Expired");
                return callback({
                    "MESSAGE": "Invalid Credentials"
                })
            } else {
                Service.userServices.updateUserDetail(checkUser, dataToSet, {}, (err, Data) => {
                    if (err) {
                        return err.message;
                    } else {
                        console.log(Data)
                        if (Data.n > 0) {
                            return callback(null, Data);
                        } else {
                            return callback(null, {
                                "MESSAGE": "NOT UPDATED"
                            });
                        }
                    }
                })
            }
        }
    })

}
//////////////To add bank Details for a particular user on the basis of mailId and sessionId/////////////////////////
const bankDetails = (data, callback) => {
    var checkUser = {
        emailId: data.emailId,
        sessionId: data.sessionId,
    }
    var dataToSet = {
        'bankDetails.bankName': data.bankName,
        'bankDetails.accountNumber': data.accountNumber,
        'bankDetails.ifsc': data.ifsc,
        'bankDetails.branch': data.branch,
    }

    Service.userServices.fetchOne(checkUser, {}, {}, (err, userData) => {
        if (err) {
            return err.message;
        } else {
            if (userData.length == 0) {
                console.log("Invalid Email or session Expired");
                return callback({
                    "MESSAGE": "Invalid Credentials"
                })
            } else {
                Service.userServices.updateUserDetail(checkUser, dataToSet, {}, (err, Data) => {
                    if (err) {
                        return err.message;
                    } else {
                        console.log(Data)
                        if (Data.n > 0) {
                            return callback(null, {
                                "MESSAGE": "BankDetails Updated"
                            });
                        } else {
                            return callback(null, {
                                "MESSAGE": "NOT UPDATED"
                            });
                        }
                    }
                })
            }
        }
    })
}
/////// For logout, end the session here ///////////////////
const logout = (data, callback) => {
    var checkEmail = {
        emailId: data.emailId,
        sessionId: data.sessionId,
    }
    var dataToSet = {
        sessionId: "",
    }
    Service.userServices.updateUserDetail(checkEmail, dataToSet, {}, (err, userData) => {
        if (err) {
            return err.message;
        } else {
            console.log(userData)
            if (userData.n > 0) {
                return callback(null, {
                    "MESSAGE": "VALID USER"
                });
            } else {
                return callback(null, {
                    "MESSAGE": "SESSION EXPIRED"
                });
            }
        }
    })
}
///////// For login on the basis of mailId , if not registered ,then we have to register it first///////////
const login = (data, callback) => {
    var criteria = {
        emailId: data.emailId,
    }
    var checkUser = {
        emailId: data.emailId,
    }
    var projection = {
        _id: 0,
        __v: 0,
    }
    Service.userServices.fetchOne(checkUser, {}, {}, (err, userData) => {
        if (err) {
            return err.message;
        } else {
            console.log(userData.length, "===============================");
            if (userData.length == 0) {
                return callback({
                    "MESSAGE": "No User Found with this EmailId"
                });
            } else {
                Service.userServices.fetchOne(criteria, projection, {}, (err, newData) => {
                    if (err) {
                        return err.message;
                    } else {
                        console.log(newData, "+++++++++++++++");
                        var SessionId = Math.random().toString(36).substr(2, 16);
                        var passwordValid = isPasswordValid(data.password, newData[0].password)
                        if (passwordValid == true) {
                            var loginCriteria = {
                                emailId: data.emailId
                            };
                            var updateCriteria = {
                                emailId: data.emailId
                            };
                            var dataToSet = {
                                sessionId: SessionId
                            };
                            var loginProjection = {
                                _id: 0,
                                __v: 0,
                                password: 0,
                                resetPasswordExpires: 0,
                                resetPasswordToken: 0,
                            };
                            Service.userServices.updateUserDetail(updateCriteria, dataToSet, {}, (err, data) => {
                                if (err) {
                                    return err.message;
                                } else {
                                    console.log(data, "UPDATED");
                                    Service.userServices.fetchOne(loginCriteria, loginProjection, {}, (err, userData) => {
                                        if (err) {
                                            return err.message;
                                        } else {
                                            return callback(null, userData);
                                        }
                                    })
                                }
                            })
                        } else {
                            return callback({
                                "MESSAGE": "Password Mismatch"
                            });
                        }
                    }
                })
            }
        }
    })
}
////////// For reseting the password on the basis of mailId ///////////////////////
const resetPassword = (data, callback) => {
    var criteria = {
        emailId: data.emailId,
    }
    var projection = {
        password: encryptedPassword(data.password),
    }
    var checkEmailOrMobile = {
        emailId: data.emailId
    }
    Service.userServices.fetchOne(checkEmailOrMobile, {}, {}, (err, userData) => {
        if (err) {
            return err.message;
        } else {
            var passwordValid = isPasswordValid(data.password, userData[0].password)
            if (passwordValid == true) {
                return callback({
                    "MESSAGE": "Cannot use same combination as used previously"
                });
            }
            if (userData.length == 0) {
                return callback({
                    "MESSAGE": "EmailId Not Registered"
                });
            } else {
                Service.userServices.updateUserDetail(criteria, projection, {}, (err, newData) => {
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
/////////For changing Password on the basis of mailId ////////////////
const changePassword = (data, callback) => {
    var criteria = {
        emailId: data.emailId,
    }
    var projection = {
        password: encryptedPassword(data.newPassword),
    }
    Service.userServices.fetchOne(criteria, {}, {}, (err, userData) => {
        if (err) {
            return err.message;
        } else {
            var passwordValid = isPasswordValid(data.password, userData[0].password)
            if (passwordValid == true) {
                var newPasswordValid = isPasswordValid(data.newPassword, userData[0].password)
                if (newPasswordValid == true) {
                    return callback({
                        "MESSAGE": "Cannot use same combination as used previously"
                    });
                } else {
                    Service.userServices.updateUserDetail(criteria, projection, {}, (err, newData) => {
                        if (err) {
                            if (err.code && err.code == 11000) {
                                return callback(err.message);
                            }
                            return callback(err);
                            length
                        } else {
                            return callback(null, newData);
                        }
                    })
                }
            } else {
                return callback({
                    "MESSAGE": "Password Mismatch"
                });
            }
        }
    })
}

const fetchAllUsers = (callback) => {
    var projections = {
        _id: 0,
        __v: 0,
        password: 0,
        resetPasswordExpires: 0,
        resetPasswordToken: 0,
    }
    Service.userServices.fetchOne({}, projections, {}, (err, userData) => {
        if (err) {
            return err.message;
        } else {
            console.log(userData.length, "===============================");
            return callback(null, userData);
        }
    })
}


//Authentication//
const gauth = (data, callback)=>{
    var checkUser = {
        emailId : data.emailId,
        // sessionId :data.sessionId,
    }
    var dataToSet = {
        google_auth: data.google_auth,
        gAuthKey: data.gAuthKey,
        // antiPhishing: data.antiPhishing,
        // antiPhishKey:data.antiPhishKey
    }

Service.userServices.fetchOne(checkUser, {}, {}, (err,userData)=>{
    if(err) {
        return err.message
    } else{
        if(userData.length == 0){
            console.log(userData)
            console.log("Invalid Email or session Expired");
            return callback({
                "MESSAGE" : "Invalid Credentials"
            })
        } else {
            Service.userServices.updateUserDetail(checkUser, dataToSet, {}, (err, Data)=>{
                if(err){
                    return err.message;
                } else{
                    console.log(Data)
                    if(Data.n > 0) {
                        return callback(null, Data);
                    }else{
                        return callback(null, {
                            "MESSAGE" : "NOT UPDATED"
                        });
                    }
                }
            })
        }
    }
})
}


const antiAuth = (data, callback)=>{
    var checkUser = {
        emailId : data.emailId,
        // sessionId :data.sessionId,
    }
    var dataToSet = {
        // google_auth: data.google_auth,
        // gAuthKey: data.gAuthKey,
        antiPhishing: data.antiPhishing,
        antiPhishKey:data.antiPhishKey
    }

Service.userServices.fetchOne(checkUser, {}, {}, (err,userData)=>{
    if(err) {
        return err.message
    } else{
        if(userData.length == 0){
            console.log(userData)
            console.log("Invalid Email or session Expired");
            return callback({
                "MESSAGE" : "Invalid Credentials"
            })
        } else {
            Service.userServices.updateUserDetail(checkUser, dataToSet, {}, (err, Data)=>{
                if(err){
                    return err.message;
                } else{
                    console.log(Data)
                    if(Data.n > 0) {
                        return callback(null, Data);
                    }else{
                        return callback(null, {
                            "MESSAGE" : "NOT UPDATED"
                        });
                    }
                }
            })
        }
    }
})
}


/////////////////smsAuthentication//////////////////
const smsAuth = (data, callback)=>{
    var checkUser = {
        emailId : data.emailId,
        // sessionId :data.sessionId,
    }
    var dataToSet = {
       
        sms_auth: data.sms_auth,
        sms_authKey: data.sms_authKey
    }

Service.userServices.fetchOne(checkUser, {}, {}, (err,userData)=>{
    if(err) {
        return err.message
    } else{
        if(userData.length == 0){
            console.log(userData)
            console.log("Invalid Email or session Expired");
            return callback({
                "MESSAGE" : "Invalid Credentials"
            })
        } else {
            Service.userServices.updateUserDetail(checkUser, dataToSet, {}, (err, Data)=>{
                if(err){
                    return err.message;
                } else{
                    console.log(Data)
                    if(Data.n > 0) {
                        return callback(null, Data);
                    }else{
                        return callback(null, {
                            "MESSAGE" : "NOT UPDATED"
                        });
                    }
                }
            })
        }
    }
})
}


///////////////////////// Check SMS AUTH KEY /////////////////////////////////
const checkSmsAuth = (data, callback) => {
    var checkSms = {
        userId: data.userId,
        sms_authKey: data.sms_authKey,
    };
    Service.userServices.fetchOne(checkSms, {}, {}, (err, userData) => {
        if (err) {
            return err.message;
        } else {
            if (userData.length == 0) {
                return callback({
                    "MESSAGE": "Invalid SMS"
                })
            } else {
               
                if (userData[0].sms_authKey == data.sms_authKey) {
                  
                        return callback(null, {
                            "MESSAGE": "Valid SMS"
                        });
                   
                } else {
                    return callback({
                        "MESSAGE": "Invalid SMS"
                    })
                }
            }
        // }
    }
})
}

const userlogin = (data, callback) => {
    var criteria = {
        emailId: data.emailId,
       
    }
    var checkUser = {
        emailId: data.emailId,
    }
    var projection = {
        _id: 0,
        __v: 0,
    }
    Service.userServices.fetchOne(checkUser, {}, {}, (err, userData) => {
        if (err) {
            return err.message;
        } else {
            console.log(userData.length, "===============================");
            if (userData.length == 0) {
                return callback({
                    "MESSAGE": "No User Found with this EmailId"
                });
            } else {
                Service.userServices.fetchOne(criteria, projection, {}, (err, newData) => {
                    if (err) {
                        return err.message;
                    } else {
                        console.log(newData, "+++++++++++++++");
                        var SessionId = Math.random().toString(36).substr(2, 16);
                        // var passwordValid = isPasswordValid(data.password, newData[0].password)
                        if (criteria) {
                            var loginCriteria = {
                                emailId: data.emailId
                            };
                            var updateCriteria = {
                                emailId: data.emailId,
                                // google_auth: "disable",
                                // gAuthKey: "",
                                // antiPhishing:"disable",
                                // antiPhishKey:"",
                                // sms_auth:""
                            };
                            var dataToSet = {
                                sessionId: SessionId
                            };
                            var loginProjection = {
                                _id: 0,
                                __v: 0,
                                password: 0,
                                resetPasswordExpires: 0,
                                resetPasswordToken: 0,
                            };
                            Service.userServices.updateUserDetail(updateCriteria, dataToSet, {}, (err, data) => {
                                if (err) {
                                    return err.message;
                                } else {
                                    console.log(data, "UPDATED");
                                    Service.userServices.fetchOne(loginCriteria, loginProjection, {}, (err, userData) => {
                                        if (err) {
                                            return err.message;
                                        } else {
                                            return callback(null, userData);
                                        }
                                    })
                                }
                            })
                        } else {
                            return callback({
                                "MESSAGE": "Password Mismatch"
                            });
                        }
                    }
                })
            }
        }
    })
}

module.exports = {
    signUp: signUp,
    login: login,
    isLoggedIn: isLoggedIn,
    logout: logout,
    // countryList: countryList,
    // cityList: cityList,
    validateOtp: validateOtp,
    resetPassword: resetPassword,
    changePassword: changePassword,
    editProfile: editProfile,
    bankDetails: bankDetails,
    fetchAllUsers: fetchAllUsers,
    gauth: gauth,
    antiAuth:antiAuth,
    smsAuth:smsAuth,
    checkSmsAuth: checkSmsAuth,
    userlogin:userlogin
}