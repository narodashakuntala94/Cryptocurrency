var Controller = require('../controllers');
var User = require('../models/user');
var async = require('async');
var nodemailer = require('nodemailer');
const Joi = require('joi');
var crypto = require('crypto');

module.exports = app => {
    app.route('/countryList').get((req, res) => {
        Controller.userController.countryList((err, data) => {
            console.log(err, data)
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.MESSAGE,
                })
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "Country List",
                    "data": data,
                })
            }
        })
    })
    app.route('/cityList').post((req, res) => {
        const validator = {
            stateName: Joi.string().required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.userController.cityList(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                if (err.MESSAGE) {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err.MESSAGE,
                    })
                } else {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err,
                    })
                }
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "City List",
                    "data": data,
                })
            }
        })
    })
    app.route('/signUp').post((req, res) => {
        const validator = {
            emailId: Joi.string().email().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/),
            mobileNumber: Joi.string().required(),
            registerFrom: Joi.string().optional(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.userController.signUp(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                if (err.MESSAGE) {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err.MESSAGE,
                    })
                } else {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err,
                    })
                }
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "SUCCESSFULLY SIGNED UP",
                    "data": data,
                })
            }
        })
    })
    app.route('/login').post((req, res) => {
        const validator = {
            emailId: Joi.string().email().required(),
            password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/).required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.userController.login(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                if (err.MESSAGE) {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err.MESSAGE,
                    })
                } else {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err,
                    })
                }
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "SUCCESSFULLY LOGGED IN",
                    "data": data,
                })
            }
        })
    })
    app.route('/logout').post((req, res) => {
        const validator = {
            emailId: Joi.string().email().required(),
            sessionId: Joi.string().required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.userController.logout(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                if (err.MESSAGE) {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err.MESSAGE,
                    })
                } else {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err,
                    })
                }
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "SUCCESSFULLY LOGGED OUT",
                })
            }
        })
    })
    app.route('/editProfile').post((req, res) => {
        const validator = {
            emailId: Joi.string().email().required(),
            sessionId: Joi.string().required(),
            address: Joi.string().required(),
            country: Joi.string().required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            pincode: Joi.string().required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.userController.editProfile(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                if (err.MESSAGE) {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err.MESSAGE,
                    })
                } else {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err,
                    })
                }
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "PROFILE UPDATED SUCCESSFULLY",
                })
            }
        })
    })

    app.route('/bankDetails').post((req, res) => {
        const validator = {
            emailId: Joi.string().email().required(),
            sessionId: Joi.string().required(),
            bankName: Joi.string().required(),
            accountNumber: Joi.string().required(),
            ifsc: Joi.string().required(),
            branch: Joi.string().required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.userController.bankDetails(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                if (err.MESSAGE) {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err.MESSAGE,
                    })
                } else {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err,
                    })
                }
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "BANKDETAILS UPDATED SUCCESSFULLY",
                })
            }
        })
    })
    app.route('/resetPassword').post((req, res) => {
        const validator = {
            emailId: Joi.string().email().required(),
            password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/).required(),
            // newPassword :Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/).required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.userController.resetPassword(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                if (err.MESSAGE) {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err.MESSAGE,
                    })
                } else {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err,
                    })
                }
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "Password Changed",
                })
            }
        })
    })

    app.route('/isLoggedIn').post((req, res) => {
        const validator = {
            emailId: Joi.string().email().required(),
            sessionId: Joi.string().required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.userController.isLoggedIn(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                if (err.MESSAGE) {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err.MESSAGE,
                    })
                    return;
                }
                res.status(400).send({
                    "Status": "0",
                    "Message": "INVALID SESSION ID",
                })
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": data.MESSAGE,
                })
            }
        })
    })

    app.route('/changePassword').post((req, res) => {
        const validator = {
            emailId: Joi.string().email().required(),
            password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/).required(),
            newPassword: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/).required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.userController.changePassword(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                if (err.MESSAGE) {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err.MESSAGE,
                    })
                } else {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err,
                    })
                }
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "Password Changed",
                })
            }
        })
    })
    app.route('/validateOTP').post((req, res) => {
        const validator = {
            emailId: Joi.string().email().required(),
            otp: Joi.string().required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.userController.validateOtp(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                if (err.MESSAGE) {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err.MESSAGE,
                    })
                    return;
                }
                res.status(400).send({
                    "Status": "0",
                    "Message": "INVALID SESSION ID",
                })
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": data.MESSAGE,
                })
            }
        })
    })
    app.route('/forgot').post((req, res, next) => {
        var email  = "coincodeexchange@gmail.com";
        var pass = "Coincode@123";
        async.waterfall([
            function (done) {
                var otp = Math.floor(100000 + Math.random() * 900000);
                done(null, otp);
            },
            function (otp, done) {
                User.findOne({
                    emailId: req.body.email
                }, function (err, user) {
                    if (!user) {
                        res.status(400).send({
                            "Status": "0",
                            "Message": "No account with that email address exists."
                        })
                    } else {
                        user.resetPasswordToken = otp;
                        user.resetPasswordExpires = Date.now() + 180000;
                        user.save(function (err) {
                            done(err, otp, user);
                        });
                    }
                });
            },
            function (otp, user, done) {
                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: email,
                        pass: pass
                    }
                });
                var mailOptions = {
                    to: user.emailId,
                    from: email , 
                    subject: 'Coincode Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please Use this OTP: ' + otp + ' to complete the process:\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    console.log('info', 'An e-mail has been sent to ' + user.emailId + ' with further instructions.');
                    done(err, 'done');
                    res.status(200).send({
                        "Status": "1",
                        "Message": "OTP Sent on Mail Address"
                    })
                });
            }
        ], function (err) {
            if (err) return next(err);
        });
    });
    app.route('/registerEmail').post((req, res, next) => {
        async.waterfall([
            function (otp, user) {
                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: '',
                        pass: ''
                    }
                });
                var mailOptions = {
                    to: req.body.emailId,
                    from: 'himanshu@coincode.in',
                    subject: 'Coincode Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please Use this OTP: ' + otp + ' to complete the process:\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    console.log('info', 'An e-mail has been sent to ' + req.body.emailId + ' with further instructions.');
                    res.status(200).send({
                        "Status": "1",
                        "Message": "OTP Sent on Mail Address"
                    })
                });
            }
        ], function (err) {
            if (err) return next(err);
        });
    });
    app.route('/fetchAllUsers').get((req, res) => {
        Controller.userController.fetchAllUsers((err, data) => {
            console.log(err, data)
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.MESSAGE,
                })
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "User List",
                    "UserCount": data.length,
                    "data": data,
                })
            }
        })
    })


    ////////////////Google Authentication////////////////////////
app.route('/gauth').post((req, res) => {
    const validator = {
        emailId: Joi.string().email().required(),
        google_auth: Joi.string().optional(),
        gAuthKey:Joi.string().optional(),
    };
    const bodyValidation = Joi.validate(req.body, validator);
    if (bodyValidation.error) {

        console.log("inside validation");
        res.status(400).send({
            "Message": bodyValidation.error.message
        });
        return;
    }
    Controller.userController.gauth(req.body, (err, data) => {
        console.log(err, data)
        if (err) {
            if (err.MESSAGE) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.MESSAGE,
                })
                return;
            }
            res.status(400).send({
                "Status": "0",
                "Message": "INVALID SESSION ID",
               })
            return;
        } else {
            res.status(200).send({
                "Status": "Google Authentication is Successfuly Done!!!",
                "Message": data.MESSAGE,
            })
        }
    });
});

////////////////////Antiphishing Auth //////////////////////
app.route('/antiAuth').post((req, res) => {
    const validator = {
        emailId: Joi.string().email().required(),
        antiPhishing:Joi.string().optional(),
        antiPhishKey:Joi.string().optional(),
    };
    const bodyValidation = Joi.validate(req.body, validator);
    if (bodyValidation.error) {

        console.log("inside validation");
        res.status(400).send({
            "Message": bodyValidation.error.message
        });
        return;
    }
    Controller.userController.antiAuth(req.body, (err, data) => {
        console.log(err, data)
        if (err) {
            if (err.MESSAGE) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.MESSAGE,
                })
                return;
            }
            res.status(400).send({
                "Status": "0",
                "Message": "INVALID SESSION ID",
               })
            return;
        } else {
            res.status(200).send({
                "Status": "1",
                "antiPhishing": req.body.antiPhishing,
                "antiPhishingKey": req.body.antiPhishKey
            })
        }
    });
});

////////////////Google Authentication////////////////////////
app.route('/gauth').post((req, res) => {
    const validator = {
        emailId: Joi.string().email().required(),
        google_auth: Joi.string().optional(),
        gAuthKey:Joi.string().optional(),
    };
    const bodyValidation = Joi.validate(req.body, validator);
    if (bodyValidation.error) {

        console.log("inside validation");
        res.status(400).send({
            "Message": bodyValidation.error.message
        });
        return;
    }
    Controller.userController.gauth(req.body, (err, data) => {
        console.log(err, data)
        if (err) {
            if (err.MESSAGE) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.MESSAGE,
                })
                return;
            }
            res.status(400).send({
                "Status": "0",
                "Message": "INVALID SESSION ID",
               })
            return;
        } else {
            res.status(200).send({
                "Status": "Google Authentication is Successfuly Done!!!",
                "Message": data.MESSAGE,
            })
        }
    });
});

////////////////SMSAUTH///////////////////////
app.route('/smsAuth').post((req,res)=>{

    const validatior = {
        emailId: Joi.string().required(),
        mobileNumber: Joi.string().required(),
        sms_auth: Joi.string().required(),
        sms_authKey: Joi.string().required()
    };
    const bodyValidation = Joi.validate(req.body, validatior);
    if(bodyValidation.error){
        console.log("inside validtion");
        res.status(400).send({
            "Message": bodyValidation.error.message
        }); 
        return;
    }
    Controller.userController.smsAuth(req.body, (err,data) => {
        console.log(err,data)
        if(err){
            if(err.MESSAGE){
                res.status(400).send({
                    "Status" : "0",
                    "Message": err.MESSAGE,
                })
                return;
            } 
            res.status(400).send({
                "Status": "0",
                "Message":"INVALID SESSION ID"
            })
            return;
        }
        else{
            res.status(200).send({
                "Status" : "1",
                "Message" : "SMS HAS BEEN SEND SUCCESSFULLY ",
                "Data": req.body.sms_auth
            })
        }

    })
})

///////////////SMSAUTH///////////////////////
app.route('/checkSmsAuth').post((req,res)=>{

    const validatior = {
        userId: Joi.string().required(),
        sms_authKey: Joi.string().required()
    };
    const bodyValidation = Joi.validate(req.body, validatior);
    if(bodyValidation.error){
        console.log("inside validtion");
        res.status(400).send({
            "Message": bodyValidation.error.message
        }); 
        return;
    }
    Controller.userController.checkSmsAuth(req.body, (err,data) => {
        console.log(err,data)
        if(err){
            if(err.MESSAGE){
                res.status(400).send({
                    "Status" : "0",
                    "Message": err.MESSAGE,
                })
                return;
            } 
            res.status(400).send({
                "Status": "0",
                "Message":"INVALID SESSION ID"
            })
            return;
        }
        else{
            res.status(200).send({
                "Status" : "1",
                "Message" : "SMS AUTHENTICATION SUCCESSFULLY DONE "
            })
        }

    })
})


    ///////Social user login///////
    app.route('/userlogin').post((req, res) => {
        const validator = {
            emailId: Joi.string().email().required(),
            // password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/).required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.userController.userlogin(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                if (err.MESSAGE) {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err.MESSAGE,
                    })
                } else {
                    res.status(400).send({
                        "Status": "0",
                        "Message": err,
                    })
                }
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "SUCCESSFULLY LOGGED IN",
                    "data": data,
                })
            }
        })
    })

    // var aws = require('aws-sdk')
    // var multer = require('multer')
    // var multerS3 = require('multer-s3')
    // aws.config.loadFromPath(__dirname + './s3_config.json', 'utf8');
    // var s3 = new aws.S3({
    //     s3ForcePathStyle: true
    // });

    // var upload = multer({
    //     storage: multerS3({
    //         s3: s3,
    //         bucket: 'cryptoexchange',
    //         metadata: function (req, file, cb) {
    //             cb(null, {
    //                 fieldName: file.fieldname
    //             });
    //         },
    //         key: function (req, file, cb) {
    //             cb(null, Date.now().toString())
    //         }
    //     })
    // })
    // app.post('/upload', upload.single('avatar'), (req, res, next) => {
    //     console.log(req.file, "req.file");
    //     console.log(`req.params`, req.body.type);
    //     res.send({
    //         "Message": "Successfully uploaded files!"
    //     });
        // Controller.userController.fetchAllUsers((err, data) => {
        //     console.log(err, data)
        //     if (err) {
        //         res.status(400).send({
        //             "Status": "0",
        //             "Message": err.MESSAGE,
        //         })
        //         return;
        //     } else {
        //         res.status(200).send({
        //             "Status": "1",
        //             "Message": "User List",
        //             "UserCount":data.length,
        //             "data": data,
        //         })
        //     }
        // })
    // })
}