var Controller = require('../controllers');
const Joi = require('joi');
module.exports = app => {
    app.route('/saveDeal').post((req, res) => {
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
            contractTime: Joi.string().optional(),
            margin: Joi.string().optional(),
            emailId:Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.dealController.saveDeal(req.body, (err, data) => {
            if (err) {
                if (err.MESSAGE) {
                    res.status(200).send({
                        "Message": err.MESSAGE,
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
                res.status(200).send({
                    "Status": "1",
                    "Message": "Success",
                    "TransactionDetails": data
                })
            }
        })
    })
    app.route('/transactDeal').get((req, res) => {
        Controller.dealController.transactDeal((err, data) => {
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
    //route for closing deal having method POST with paramaeters transactionId required
    app.route('/closeDeal').post((req, res) => {
        const validator = {
            transactionId: Joi.string().required(),
        }
    ///for validating the body params//////////
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        ////function which is in controller to close the deal//////////////
        Controller.dealController.closeDeal(req.body, (err, data) => {
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
    app.route('/transactContract').get((req, res) => {
        Controller.dealController.transactContract((err, data) => {
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                })
                return;
            } else {
                if (data.length > 0) {
                    res.status(200).send({
                        "Status": "1",
                        "Message": "Success",
                        "TransactionDetails": data
                    })
                } else {
                    res.status(200).send({
                        "Status": "0",
                        "Message": "No Transactions Found",
                    })
                }
            }
        })
    })
    app.route('/StopLossOrProfit').get((req, res) => {
        Controller.dealController.stopLossOrProfit((err, data) => {
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
}