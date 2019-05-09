var Controller = require('../controllers');
var Service = require('../services');
const Joi = require('joi');
module.exports = app => {
    app.route('/fetchUserOrders').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
            symbol: Joi.string().optional(),
            buyFrom: Joi.string().optional(),
            dealType: Joi.string().required(),
            type: Joi.string().optional(),
            status:Joi.string().optional(),
            timePeriod: Joi.string().optional(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        } 
        // var closureForUpdateData = (i) => {
        //     const updateFunction = () => {
        //         newArray.push({
        //             priceUSD: Number(gData[i].limitRate),
        //             priceBTC: gData[i].limitRate * btcFactor,
        //             priceCCD: gData[i].limitRate * ccdFactor,
        //         });
        //         return newArray;
        //     }
        //     return updateFunction;
        // }
        // var newArray = [];
        // var gData, ccdFactor, btcFactor
        Controller.transactionController.fetchOrders(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                    "MESSAGE": "NOT UPDATED"
                })
                return;
            } else {
                if (data.length == 0) {
                    res.status(200).send({
                        "Status": "0",
                        "Message": "No Such Orders",
                    })
                } else {
                    // gData = data;
                    // var criteria = {
                    //     $or: [{
                    //         symbol: "BTC"
                    //     }, {
                    //         symbol: "CCD"
                    //     }]
                    // }
                    // Service.cryptoServices.fetchOneData(criteria, {}, {}, (err, Data) => {
                    //     if (err) {
                    //         res.status(400).send({
                    //             "Status": "0",
                    //             "Message": err.Message,
                    //         })
                    //         return;
                    //     } else {
                    //         // btcFactor = 1 / Data[0].buyingPriceUsd;
                    //         // ccdFactor = 1 / Data[1].buyingPriceUsd;
                    //         // console.log(1 / Data[0].buyingPriceUsd, 1 / Data[1].buyingPriceUsd, "DATA");
                    //         // for (var i = 0; i < data.length; i++) {
                    //         //     var adminclosure = closureForUpdateData(i);
                    //         //     var resulting = adminclosure();
                    //         // }
                    //         console.log(newArray, "data");
                    //     }
                        res.status(200).send({
                            "Status": "1",
                            "Message": "Success",
                            "TransactionCount": data.length,
                            "TransactionDetails": data,
                        })
                    //})
                }
            }
        })
    })
    app.route('/fetchOrders').post((req, res) => {
        const validator = {
            symbol: Joi.string().required(),
            buyFrom: Joi.string().required(),
            dealType: Joi.string().required(),
            type: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        var closureForUpdateData = (i) => {
            const updateFunction = () => {
                if (gData[i].type == "SELL"){
                    newArray.push({
                        priceUSD: Number(gData[i].limitRate),
                        priceBTC: gData[i].limitRate * btcFactor,
                        priceCCD: gData[i].limitRate * ccdFactor,
                        volume:gData[i].buyFromQuantity,
                    });  
                }else{
                    newArray.push({
                        priceUSD: Number(gData[i].limitRate),
                        priceBTC: gData[i].limitRate * btcFactor,
                        priceCCD: gData[i].limitRate * ccdFactor,
                        volume:gData[i].amount,
                    });
                }
                console.log(`gData[i].limitRate`,gData[i].limitRate);
                return newArray;
            }
            return updateFunction;
        }
        var newArray = [];
        var gData, ccdFactor, btcFactor
        Controller.transactionController.fetchAllOrders(req.body, (err, data) => {
            
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                    "MESSAGE": "NOT UPDATED"
                })
                return;
            } else {
                if (data.length == 0) {
                    res.status(200).send({
                        "Status": "0",
                        "Message": "No Such Orders",
                    })
                } else {
                    gData = data;
                    var criteria = {
                        $or: [{
                            symbol: "BTC"
                        }, {
                            symbol: "CCD"
                        }]
                    }
                    Service.cryptoServices.fetchOneData(criteria, {}, {}, (err, Data) => {
                        if (err) {
                            res.status(400).send({
                                "Status": "0",
                                "Message": err.Message,
                            })
                            return;
                        } else {
                            console.log(Data,"DATA++_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+__+_");
                            btcFactor = 1 / Data[0].buyingPriceUsd;
                            ccdFactor = 1 / Data[1].buyingPriceUsd;
                            console.log(1 / Data[0].buyingPriceUsd, 1 / Data[1].buyingPriceUsd, "DATA");
                            for (var i = 0; i < data.length; i++) {
                                var adminclosure = closureForUpdateData(i);
                                var resulting = adminclosure();
                            }
                            console.log(newArray, "data");
                        }
                        res.status(200).send({
                            "Status": "1",
                            "Message": "Success",
                            "TransactionCount": newArray.length,
                            "TransactionDetails": newArray,
                        })
                    })
                }
            }
        })
    })
    app.route('/fetchPairTransaction').post((req, res) => {
        const validator = {
            symbol: Joi.string().required(),
            buyFrom: Joi.string().required(),
            transactionStatus: Joi.string().required(),
            dealType: Joi.string().optional(),
            userId: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.transactionController.fetchPairTransaction(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                })
                return;
            } else {
                if (data.length == 0) {
                    res.status(200).send({
                        "Status": "0",
                        "Message": "No Such Transaction Exists with this TransactionId",
                    })
                } else {
                    res.status(200).send({
                        "Status": "1",
                        "Message": "Success",
                        "TransactionCount": data.length,
                        "TransactionDetails": data
                    })
                }
            }
        })
    })
    app.route('/fetchTransactionId').post((req, res) => {
        const validator = {
            transactionId: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.transactionController.fetchTransaction(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                })
                return;
            } else {
                if (data.length == 0) {
                    res.status(200).send({
                        "Status": "0",
                        "Message": "No Such Transaction Exists with this TransactionId",
                    })
                } else {
                    res.status(200).send({
                        "Status": "2",
                        "Message": "Success",
                        "TransactionDetails": data
                    })
                }
            }
        })
    })
    app.route('/depositmoney').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
            amount: Joi.string().required(),
            paymentProviderId: Joi.string().optional(),
            symbol: Joi.string().required(),
            symbol: Joi.string().required(),
            sellRate: Joi.number().required(),
            gst: Joi.number().required(),
            buyRate: Joi.number().required(),
            fees
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            // console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.transactionController.addMoney(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                res.status(400).send({
                    "Message": err
                })
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "Success",
                    "data": data
                })
            }
        })
    })
    app.route('/fetchTransaction').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
            symbol: Joi.string().optional(),
            transactionStatus: Joi.string().optional(),
            limitStatus: Joi.string().optional(),
            type: Joi.string().optional(),
            specificSymbol: Joi.string().optional(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.transactionController.fetchTransaction(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                })
                return;
            } else {
                if (data.length == 0) {
                    res.status(200).send({
                        "Status": "0",
                        "Message": "No Transactions Found",
                    })
                } else {
                    res.status(200).send({
                        "Status": "1",
                        "Message": "Success",
                        "TransactionCount": (data.length).toString(),
                        "TransactionDetails": data
                    })
                }
            }
        })
    })
    app.route('/updateTransactionCron').get((req,res) => {

        Controller.transactionController.updateTransactionCron((err, data) => {
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                })
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "Success",
                    "TransactionDetails": data
                })
            }
        })
    })
    app.route('/ERC20transaction').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
            symbol: Joi.string().required(),
            recieverAddress: Joi.string().required(),
            type: Joi.string().required(),
            fees: Joi.string().optional(),
            amount: Joi.string().required(),
            emailId:Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.transactionController.erc20Transaction(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                })
                return;
            } else {
                if (data.length == 0) {
                    res.status(200).send({
                        "Status": "0",
                        "Message": "No Transactions Found",
                    })
                } else {
                    res.status(200).send({
                        "Status": "1",
                        "Message": "Success",
                        //"TransactionCount": (data.length).toString(),
                        "TransactionDetails": data,
                    })
                }
            }
        })
    })
    app.route('/fetchTransactionWithWallet').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
            symbol: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.transactionController.fetchTransaction(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                })
                return;
            } else {
                if (data.length == 0) {
                    res.status(200).send({
                        "Status": "0",
                        "Message": "No Such User Exists with this UserId",
                    })
                } else {
                    Controller.walletController.fetchWalletDetailsINR(req.body, (err, walletData) => {
                        console.log(err, walletData);
                        var particularWallet = {};
                        if (err) {
                            if (err.code && err.code == 11000) {
                                return callback(err.message);
                            }
                            return callback(err);
                        } else {
                            var length = walletData[0].wallet.length;
                            if (length != 0) {
                                // console.log(walletData[0].wallet[0].symbol, "inside==========================", req.body.symbol, length)
                                for (var i = 0; i < length; i++) {
                                    if (walletData[0].wallet[i].symbol == req.body.symbol) {
                                        // console.log("INSIDER")
                                        particularWallet.name = walletData[0].wallet[i].name;
                                        particularWallet.symbol = walletData[0].wallet[i].symbol;
                                        particularWallet.sCryptoImage = walletData[0].wallet[i].sCryptoImage;
                                        particularWallet.sINRBalance = walletData[0].wallet[i].sINRBalance;
                                        particularWallet.sETHBalance = walletData[0].wallet[i].sETHBalance;
                                        particularWallet.sBTCBalance = walletData[0].wallet[i].sBTCBalance;
                                        particularWallet.sUSDBalance = walletData[0].wallet[i].sUSDBalance;
                                        particularWallet.sMargin = walletData[0].wallet[i].sMargin;
                                        particularWallet.sProfitLoss = walletData[0].wallet[i].sProfitLoss;
                                        particularWallet.privateAddress = walletData[0].wallet[i].privateAddress;
                                        particularWallet.publicAddress = walletData[0].wallet[i].publicAddress;
                                        particularWallet.sType = walletData[0].wallet[i].sType;
                                    }
                                }
                            }
                            // console.log(particularWallet, "+++++++++++++++++++++++")
                            res.status(200).send({
                                "Status": "1",
                                "Message": "Success",
                                "TransactionCount": (data.length).toString(),
                                "WalletDetails": particularWallet,
                                "TransactionDetails": data
                            })
                        }
                    })
                }
            }
        })
    })
    app.route('/fetchBuySellTransaction').post((req, res) => {
        const validator = {
            type: Joi.string().required(),
            symbol: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.transactionController.fetchBuySellTransaction(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                })
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "Success",
                    "TransactionCount": data.length,
                    "TransactionDetails": data
                })
            }
        })
    })
    app.route('/fetchAllTransactions').get((req,res) => {

        Controller.transactionController.fetchAllTransactions((err, data) => {
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                })
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "Success",
                    "Count":data.length,
                    "TransactionDetails": data
                })
            }
        })
    })
    app.route('/fetchTransactionFromEmailId').post((req, res) => {
        const validator = {
            emailId: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.transactionController.fetchTransactionFromEmail(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                })
                return;
            } else {
                if (data.length == 0) {
                    res.status(200).send({
                        "Status": "0",
                        "Message": "No Transactions Found",
                    })
                } else {
                    res.status(200).send({
                        "Status": "1",
                        "Message": "Success",
                        "TransactionCount": data.length,
                        "TransactionDetails": data
                    })
                }
            }
        })
    })
}