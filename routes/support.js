var Controller = require('../controllers');
const Joi = require('joi');

module.exports = app => {
    app.route('/saveSupportTicket').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
            subject: Joi.string().required(),
            description: Joi.string().required(),
            emailId: Joi.string().required(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.supportController.addSupportTicket(req.body, (err, data) => {
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
                    "Data": data,
                    "Message":"Succesfully Created"
                })
            }
        })
    })
    app.route('/viewUserSupportTicket').post((req, res) => {
        const validator = {
            userId: Joi.string().optional(),
            status: Joi.string().optional(),
            ticketId: Joi.string().optional(),
        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.supportController.findSupportTicket(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err,
                })
                return;
            } else {
                console.log(data.length, "length")
                if (data.length == 0) {
                    res.status(200).send({
                        "Status": "1",
                        "Count":data.length,
                        "Message": "No Tickets Found"
                    })
                }else{
                    res.status(200).send({
                        "Status": "1",
                        "Count":data.length,
                        "Data": data
                    })
                }
               
            }
        })
    })
    app.route('/viewSupportTicket').get((req, res) => {
        Controller.supportController.viewSupportTicket((err, data) => {
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

}