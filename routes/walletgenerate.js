var Controller = require('../controllers');
const Joi = require('joi');

module.exports = app => {
    app.route('/saveWalletDetails').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.walletController.SaveWalletDetails(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Message": err,
                    "Status": "0"
                })
                return;
            } else {
                res.status(200).send({
                    "Message": "Success",
                    "Status": "1",
                    "data": data
                })
            }
        });
    })
    app.route('/createWalletAddress').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
            symbol: Joi.string().required(),
            name: Joi.string().optional(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.walletController.createWalletAddress(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Message": err,
                    "Status": "0"

                })
                return;
            } else {
                // if (data.n == '0') {
                //     res.status(400).send({
                //         "Message": "NOT A VALID USERID",
                //         "Status": "0"

                //     })
                //     return;
                // }
                res.status(200).send({
                    "Message": "Success",
                    "Status": "1",
                    "data": data
                })
            }
        });
    })
    app.route('/internalExchange').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
            transactionType: Joi.string().required(),
            type: Joi.string().required(),
            buySellRate: Joi.string().required(),
            quantity: Joi.string().required(),
            fees: Joi.string().required(),
            exchangeCurrencyFrom: Joi.string().required(),
            exchangeCurrencyTo: Joi.string().required(),
            stopLoss: Joi.string().required(),
            stopProfit: Joi.string().required(),
            requiredAmount: Joi.string().required(),
            limitRate: Joi.string().optional(),
            emailId:Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.walletController.InternalTransfers(req.body, (err, data) => {
            if (err) {
                if (err.MESSAGE == "INSUFFICIENT FUNDS") {
                    res.status(200).send({
                        "Message": "INSUFFICIENT FUNDS",
                        "Status": "0",
                    })
                    return;
                } else {
                    res.status(400).send({
                        "Message": err,
                        "Status": "0"
                    })
                    return;
                }
            } else {
                console.log(data, "data++++++++++++++++")
                if (data.MESSAGE == "INSUFFICIENT FUNDS") {
                    res.status(200).send({
                        "Message": "INSUFFICIENT FUNDS",
                        "Status": "0",
                    })
                } else {
                    res.status(200).send({
                        "Message": "Success",
                        "Status": "1",
                        "data": data
                    })
                }
            }
        })
    })
    app.route('/sendCoins').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
            recieverAddress: Joi.string().required(),
            amount: Joi.number().required(),
            walletId: Joi.string().required(),
            symbol: Joi.string().required(),
            type: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.walletController.sendCoins(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Message": err,
                    "Status": "0"
                })
                return;
            } else {
                if (data.nModified == "0") {
                    res.status(200).send({
                        "Message": "Kindly Enter Valid Values",
                        "Status": "0",
                    })
                } else {
                    res.status(200).send({
                        "Message": "Success",
                        "Status": "1",
                        "data": data
                    })
                }
            }
        })

    })
    app.route('/updateWalletDetails').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
            symbol: Joi.string().required(),
            amount: Joi.number().required(),
            type: Joi.string().required(),
            paymentProviderId: Joi.string().optional(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({

                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.walletController.updateWalletDetails(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Message": err,
                    "Status": "0"
                })
                return;
            } else {
                if (data.nModified == "0") {
                    res.status(200).send({
                        "Message": "Kindly Enter Valid Values",
                        "Status": "0",
                    })
                } else {
                    res.status(200).send({
                        "Message": "Success",
                        "Status": "1",
                        "data": data
                    })
                }
            }
        })
    })
    app.route('/fetchWalletDetails').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
            symbol: Joi.string().optional(),
            walletId: Joi.string().optional(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error){
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.walletController.fetchWalletDetails(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Message": err,
                    "Status": "0"
                })
                return;
            } else {
                Controller.transactionController.fetchTransaction(req.body, (err, Newdata) => {
                    if (err) {
                        res.status(400).send({
                            "Message": err,
                            "Status": "0"
                        })
                        return;
                    } else {
                        res.status(200).send({
                            "Message": "Success",
                            "Status": "1",
                            "data": data,
                            "transactionCount": "'" + Newdata.length + "'",
                            "transaction": Newdata,
                        })
                    }
                })
            }
        })
    })
    app.route('/fetchFourWalletDetails').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.walletController.fetchFourWalletDetails(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Message": err,
                    "Status": "0"
                })
                return;
            } else {
                res.status(200).send({
                    "Message": "Success",
                    "Status": "1",
                    "data": data,
                })
            }
        })
    })
    app.route('/fetchZeroBalance').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.walletController.fetchZeroBalance(req.body, (err, data) => {
            if (err) {
                res.status(400).send({
                    "Message": err,
                    "Status": "0"
                })
                return;
            } else {
                res.status(200).send({
                    "Message": "Success",
                    "Status": "1",
                    "data": data,
                })
            }
        })
    })
}