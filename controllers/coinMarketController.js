var Service = require('../services');

//// for updating coinmarket collection for a particular field /////////////////////////
const Update = (data, updatedata, callback) => {
    Service.coinMarketServices.update(data, updatedata, {
        new: true
    }, function (err, newData) {
        if (err) {
            if (err.code && err.code == 11000) {
                return callback(err.message);
            }
            return callback(err);
        } else {
            return callback(null, newData);
            console.log(newData, "NEWDATA")
        }
    })
}
/////////// for fetching one currency on the basis of symbol ///////////////////////// 
const fetchOneCurrency = (data, callback) => {
    Service.coinMarketServices.fetchOneCurrency({
        symbol: data.symbol
    }, {}, {}, function (err, newData) {
        if (err) {
            if (err.code && err.code == 11000) {
                return callback(err.message);
            }
            return callback(err);
        } else {
            return callback(null, newData);
            console.log(newData, "NEWDATA")
        }
    })
}

/////////// for fetching all the data from coinmarket collection ///////////////////////////
const findDetail = (callback) => {
    Service.coinMarketServices.fetchDetails((err, newData) => {
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



module.exports = {
    findDetail: findDetail,
    Update: Update,
    fetchOneCurrency: fetchOneCurrency,
}