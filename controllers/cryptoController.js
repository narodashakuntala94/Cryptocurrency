var Service = require('../services');
////////For updating live rates in cryptorates collection /////////////
const updateCryptoRates = (data, updatedata, callback) => {
    Service.cryptoServices.updateCryptoRates(data, updatedata, {
        new: true
    }, (err, newData) => {
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
///////////////For saving live rates to cryptorates collection///////////////
const insertCryptoRates = (data, callback) => {
    Service.cryptoServices.saveCryptoRates(data, (err, newData) => {
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
///////////// For saving data for graph in graphrates collection///////////////////
const insertGraphRates = (data, callback) => {
    Service.cryptoServices.saveGraphRates(data, (err, newData) => {
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
/////////////For fetching graph data from graphrates collections////////////////////
const fetchGraphData = (callback) => {
    Service.cryptoServices.fetchGraphData((err, newData) => {
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
/////////// For fetching one currency from cryptorates collection ///////////////////////
const fetchOneCryptoData = (data, callback) => {
    var criteria = {
        symbol: data.symbol,
    }
    Service.cryptoServices.fetchOneCryptoData(criteria, {}, {}, (err, newData) => {
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

/////////For website ,to add the combination to favourites in favourite collection /////////////
const addFavourite = (data, callback) => {
    var criteria = {
        symbol: data.symbol,
        exchangeCurrencyFrom: data.exchangeCurrencyFrom,
        userId: data.userId,
        percent_change_24h: data.percent_change_24h,
        price: data.price,
        volume24h: data.volume24h,
        createdAt: new Date().toISOString(),
        img: data.img,
        isFavourite: 1,
    }
    var checkFav = {
        $and: [{
            symbol: data.symbol
        },{
            exchangeCurrencyFrom: data.exchangeCurrencyFrom
        },{
            userId: data.userId
        },]
    }
 Service.coinMarketServices.fetchFavourite(checkFav, {}, {}, (err, favData) => {
        // console.log(favData, '------ Fav data -------')
        if (favData.length > 0) {
            if (err) {
                return err.message;
            } else {
                if (favData.length > 0) {
                    if (favData[0].userId==criteria.userId && favData[0].symbol == criteria.symbol && favData[0].exchangeCurrencyFrom == criteria.exchangeCurrencyFrom) {
                        return callback({
                            "MESSAGE": "Data Already Exists"
                        });
                    }
                }
            }
        } else {
            Service.coinMarketServices.saveFavourite(criteria, (err, newData) => {
                console.log(newData + "-------- NewData --------")
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
    })
}
/////////For fetching favourite on basis of userId and isfavourite flag  from favourite collection /////////////////
const fetchFavourite = (data, callback) => {
    var criteria = {
        userId: data.userId,
        isFavourite: true,
    }
    Service.coinMarketServices.fetchFavourite(criteria, {}, {}, (err, newData) => {
        if (err) {
            if (err.code && err.code == 11000) {
                return callback(err.message);
            }



            return callback(err);
        }else {
            return callback(null, newData);
        }
    })
}
////////// For deleting a combination from favourite collection on basis of userId and currency symbol combination //////
const deleteFavourite = (data, callback) => {
    var criteria = {
        userId: data.userId,
        exchangeCurrencyFrom: data.exchangeCurrencyFrom,
        symbol: data.symbol,
    }
    Service.coinMarketServices.deleteFavourite(criteria, (err, newData) => {
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
module.exports = {
    fetchOneCryptoData: fetchOneCryptoData,
    updateCryptoRates: updateCryptoRates,
    insertCryptoRates: insertCryptoRates,
    insertGraphRates: insertGraphRates,
    fetchGraphData: fetchGraphData,
    addFavourite: addFavourite,
    fetchFavourite: fetchFavourite,
    deleteFavourite: deleteFavourite,
}