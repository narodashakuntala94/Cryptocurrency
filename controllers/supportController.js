var Service = require('../services');
const addSupportTicket = (data, callback) => {
    var criteria = {
        userId: data.userId,
        emailId: data.emailId,
        subject: data.subject,
        description: data.description,
        createdAt: new Date().toISOString(),
        status: "OPEN",
    }
    Service.supportServices.saveTicket(criteria, (err, newData) => {
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
const findSupportTicket = (data, callback) => {
    if (data.ticketId) {
        var criteria = {
            _id: data.ticketId,
        }
    } else if (data.status) {
        var criteria = {
            userId: data.userId,
            status: data.status,
        }
    } else {
        var criteria = {
            userId: data.userId,
        }
    }
    Service.supportServices.findTicket(criteria, {}, {}, (err, newData) => {
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
const viewSupportTicket = (callback) => {
    Service.supportServices.viewTicket((err, newData) => {
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
findSupportTicket
module.exports = {
    addSupportTicket: addSupportTicket,
    viewSupportTicket: viewSupportTicket,
    findSupportTicket: findSupportTicket,
}