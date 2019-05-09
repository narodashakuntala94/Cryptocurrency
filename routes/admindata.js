var Controller = require('../controllers');
const Joi = require('joi');
const validator = {
    symbol: Joi.string().required(),
    buyrate: Joi.string().required(),
    sellrate: Joi.string().required(),
    fees: Joi.string().required(),
    gst: Joi.string().required(),

};
module.exports = app => {
    app.route('/adminSignUp').post((req, res) => {
        const validator = {
            emailId: Joi.string().email().required(),
            password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.adminController.signUp(req.body, (err, data) => {
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
                    "Message": "ADMIN SUCCESSFULLY SIGNED UP",
                    "data": data,
                })
            }
        })
    })
    app.route('/viewAdminDetail').get((req, res) => {
        Controller.adminController.viewAdminData((err, data) => {
            console.log(err, data)
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err,
                })
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "Success",
                    "data": data,
                })
            }
        });
    });
    app.route('/saveAdminData').post((req, res) => {
        const validator = {
            symbol: Joi.string().required(),
            sellRate: Joi.number().required(),
            gst: Joi.number().required(),
            buyRate: Joi.number().required(),
            fees: Joi.number().required(),
            margin: Joi.number().optional(),
            contractBuyRate: Joi.number().optional(),
            contractSellRate: Joi.number().optional(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.adminController.saveAdminData(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err,
                })
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Data": data
                })
            }
        })
    })
    app.route('/editAdminData').post((req, res) => {
        const validator = {
            symbol: Joi.string().required(),
            sellRate: Joi.number().required(),
            gst: Joi.number().required(),
            buyRate: Joi.number().required(),
            fees: Joi.number().required(),
            margin: Joi.number().required(),
            contractBuyRate: Joi.number().required(),
            contractSellRate: Joi.number().required(),
            minimumQuantity:Joi.number().required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.adminController.editAdminData(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err,
                })
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "Updated Successfully"
                })
            }
        })
    })
    app.route('/fetchMarginRate').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
            exchangeCurrencyTo: Joi.string().required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.adminController.fetchOne(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                res.status(400).send({
                    "Message": err
                })
                return;
            } else {
                res.status(200).send(data)
            }
        })
    })

}