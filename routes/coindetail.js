var Controller = require('../controllers');
const Joi = require('joi');
var length, OpenedAt;
var percent_change_24h;
const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
var startOfDay = Math.floor(Date.now() / interval) * interval;
var endOfDay = startOfDay + interval - 1; // 23:59:59:9999

module.exports = app => {
    app.route('/viewCoinMarket').get((req, res) => {
        Controller.coinDetailController.viewData((err, data) => {
            if (err) {
                res.status(400).send({
                    "Status": "0",
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
        });
    });
    app.route('/fetchDataTimestamp').post((req, res) => {
        const validator = {
            currencysymbol: Joi.string().required(),
            type: Joi.string().required(),

        };
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            console.log("inside validation");
            res.status(400).send({
                "Status": "0",
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.coinDetailController.fetchDataTimestamp(req.body, (err, data) => {
            console.log(err, data)
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                })
                return;
            } else {
                length = data.length
                console.log(length,"========================================length");
                if (length > 0) {
                    console.log(length, "========================================length");
                    var newbody = [];
                    var usdMin = 999999999999999;
                    var usdMax = 0;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].buyingPriceUsd < usdMin) {
                            usdMin = data[i].buyingPriceUsd
                        } else if (data[i].buyingPriceUsd > usdMax) {
                            usdMax = data[i].buyingPriceUsd;
                        }
                    }
                    for (var i = 0; i < length; i++) {
                        if ((data[i].updatedAt + "000") >= startOfDay && (data[i].updatedAt + "000") <= endOfDay) {
                            newbody.push(data[i]);
                        }
                    }
                    if (newbody.length != 0) {
                        console.log("INSIDE")
                        var min = 999999999999999;
                        var max = 0;
                        // var min_inr = "999999999999999";
                        // var max_inr = "0";
                        percent_change_24h = newbody[newbody.length - 1].percentChange24h;
                        // percent_change_1h = newbody[newbody.length - 1].percent_change_1h;
                        // percent_change_7d = newbody[newbody.length - 1].percent_change_7d;
                        OpenedAt = newbody[0].buyingPriceUsd;
                        for (var i = 0; i < newbody.length; i++) {
                            if (newbody[i].buyingPriceUsd < min) {
                                min = newbody[i].buyingPriceUsd
                            } else if (newbody[i].buyingPriceUsd > max) {
                                max = newbody[i].buyingPriceUsd;
                            }
                            // else if (newbody[i].buyingPriceCcd < min_inr) {
                            //     min_inr = newbody[i].price_inr
                            // } else if (newbody[i].buyingPriceCcd > max_inr) {
                            //     max_inr = newbody[i].price_inr;
                            // }
                        }
                    }
                }
                console.log(min, max, percent_change_24h);
                res.status(200).send({
                    //////CHANGE 0**********************************************************//////////////////////
                    "Status": "1",
                    "Message": "Success",
                    "OpenedAt": OpenedAt,
                    "MIN": usdMin,
                    "MAX": usdMax,
                    "dailyMin": min,
                    "dailyMax": max,
                    // "price_inr_MIN": min_inr,
                    // "price_inr_MAX": max_inr,
                    "percent_change_24h": percent_change_24h,
                    // "percent_change_1h": percent_change_1h,
                    // "percent_change_7d": percent_change_7d,
                    "data": data
                })
            }
        })
    });

    app.route('/fetchDataTimestamp').get((req, res) => {
        // const validator = {
        //     currencysymbol: Joi.string().required(),
        //     type: Joi.string().required(),

        // };
        // const bodyValidation = Joi.validate(req.body, validator);
        // if (bodyValidation.error) {
        //     console.log("inside validation");
        //     res.status(400).send({
        //         "Status": "0",
        //         "Message": bodyValidation.error.message
        //     });
        //     return;
        // }
        console.log(req.query,"REQ>QUERY");
        Controller.coinDetailController.getFetchDataTimestamp(req.query, (err, data) => {
            console.log(err, data)
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err.Message,
                })
                return;
            } else {
                length = data.length
                console.log(length,"========================================length");
                if (length > 0) {
                    console.log(length, "========================================length");
                    var newbody = [];
                    var usdMin = 999999999999999;
                    var usdMax = 0;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].buyingPriceUsd < usdMin) {
                            usdMin = data[i].buyingPriceUsd
                        } else if (data[i].buyingPriceUsd > usdMax) {
                            usdMax = data[i].buyingPriceUsd;
                        }
                    }
                    for (var i = 0; i < length; i++) {
                        if ((data[i].updatedAt + "000") >= startOfDay && (data[i].updatedAt + "000") <= endOfDay) {
                            newbody.push(data[i]);
                        }
                    }
                    if (newbody.length != 0) {
                        console.log("INSIDE")
                        var min = 999999999999999;
                        var max = 0;
                        // var min_inr = "999999999999999";
                        // var max_inr = "0";
                        percent_change_24h = newbody[newbody.length - 1].percentChange24h;
                        // percent_change_1h = newbody[newbody.length - 1].percent_change_1h;
                        // percent_change_7d = newbody[newbody.length - 1].percent_change_7d;
                        OpenedAt = newbody[0].buyingPriceUsd;
                        for (var i = 0; i < newbody.length; i++) {
                            if (newbody[i].buyingPriceUsd < min) {
                                min = newbody[i].buyingPriceUsd
                            } else if (newbody[i].buyingPriceUsd > max) {
                                max = newbody[i].buyingPriceUsd;
                            }
                            // else if (newbody[i].buyingPriceCcd < min_inr) {
                            //     min_inr = newbody[i].price_inr
                            // } else if (newbody[i].buyingPriceCcd > max_inr) {
                            //     max_inr = newbody[i].price_inr;
                            // }
                        }
                        console.log(min, max, percent_change_24h);
                    }
                }
              
                res.status(200).send({
                    //////CHANGE 0**********************************************************//////////////////////
                    "Status": "1",
                    "Message": "Success",
                    "OpenedAt": OpenedAt,
                    "MIN": usdMin,
                    "MAX": usdMax,
                    "dailyMin": min,
                    "dailyMax": max,
                    // "price_inr_MIN": min_inr,
                    // "price_inr_MAX": max_inr,
                    "percent_change_24h": percent_change_24h,
                    // "percent_change_1h": percent_change_1h,
                    // "percent_change_7d": percent_change_7d,
                    "data": data
                })
            }
        })
    });

}



////////*************************************************V1 response API***********************************************//////////
// const request = require('request');
// const Config = require('../config');
// var ETHfactor;
// var recievedAdminData;
// var recievedDetails;
// var percent_change_7d;
// var percent_change_1h;
//app.route('/saveData').get(function (req, res) {
//     Controller.adminController.viewAdminData(function (err, data) {
//         // console.log(err, data)
//         if (err) {
//             return err.Message;
//         } else {
//             // console.log(data, "====================================================================data")
//             recievedAdminData = data;
//         }
//     });
//     request(Config.URL.liveRateURL, function (err, resp, body) {
//         if (err) {
//             return err;
//         }
//         var newbody = JSON.parse(body);
//         for (var i = 0; i < newbody.length; i++) {
//             if (newbody[i].symbol == "ETH") {
//                 ETHfactor = (1 / newbody[i].price_usd);
//             }
//         }
//         // console.log(typeof newbody, "+++++++++++++++++++++++++++++++++++++++++++++++")
//         request(Config.URL.conversionURL, function (err, respnse, conversionbody) {
//             var convertedRates = JSON.parse(conversionbody)
//             // console.log(conversion.rates.INR,"conversion");
//             for (var i = 0; i < newbody.length; i++) {
//                 if (newbody[i].max_supply == null) {
//                     newbody[i].max_supply = "";
//                 }
//                 // console.log((newbody[i].last_updated),"LASTUPDATED")
//                 newbody[i].timestamp = new Date((newbody[i].last_updated) * 1000)
//                 newbody[i].price_inr = parseFloat(newbody[i].price_usd * convertedRates.rates.INR).toFixed(2);
//                 newbody[i].price_eth = parseFloat(newbody[i].price_usd * ETHfactor).toFixed(2);
//                 if (recievedAdminData) {
//                     // console.log(recievedAdminData, "======================================================recievedAdminData")
//                     for (var j = 0; j < recievedAdminData.length; j++) {
//                         if (recievedAdminData[j].currencysymbol == newbody[i].symbol) {
//                             newbody[i].price_inr = (newbody[i].price_inr * recievedAdminData[j].buyrate);
//                             newbody[i].price_usd = (newbody[i].price_usd * recievedAdminData[j].buyrate);
//                             newbody[i].sellrate_INR = (newbody[i].price_inr * recievedAdminData[j].sellrate);
//                             newbody[i].sellrate_USD = (newbody[i].price_usd * recievedAdminData[j].sellrate);
//                             newbody[i].price_eth = (newbody[i].price_eth * recievedAdminData[j].buyrate);
//                             newbody[i].price_btc = (newbody[i].price_btc * recievedAdminData[j].buyrate);
//                             newbody[i].sellrate_ETH = (newbody[i].price_eth * recievedAdminData[j].sellrate);
//                             newbody[i].sellrate_BTC = (newbody[i].price_btc * recievedAdminData[j].sellrate);
//                         }
//                     }
//                 }
//             }
//             Controller.coinDetailController.createDetails(newbody, function (err, data) {
//                 console.log(err, data)
//                 if (err) {
//                     res.status(400).send({
//                         "Status": "0",
//                         "Message": err.Message
//                     })
//                     return;
//                 } else {
//                     res.status(200).send({
//                         "Status": "1",
//                         "Message": "Successfully Saved",
//                         "data": data
//                     })
//                 }
//             })
//         })
//     })
// });

// app.route('/fetchDataTimestamp').post(function (req, res) {
//     const validator = {
//         currencysymbol: Joi.string().required(),
//         type: Joi.string().required(),

//     };
//     const bodyValidation = Joi.validate(req.body, validator);
//     if (bodyValidation.error) {
//         console.log("inside validation");
//         res.status(400).send({
//             "Status": "0",
//             "Message": bodyValidation.error.message
//         });
//         return;
//     }
//     Controller.coinDetailController.fetchDataTimestamp(req.body, function (err, data) {
//         console.log(err, data)
//         if (err) {
//             res.status(400).send({
//                 "Status": "0",
//                 "Message": err.Message,
//             })
//             return;
//         } else {
//             length = data.length
//             console.log(length,"========================================length");
//             if (length > 0) {
//                 console.log(length,"========================================length");
//                 var newbody = [];
//                 var usdMin = "999999999999999";
//                 var usdMax = "0";
//                 for (var i = 0; i < data.length; i++) {
//                     if (data[i].price_usd < usdMin) {
//                         usdMin = data[i].price_usd
//                     } else if (data[i].price_usd > usdMax) {
//                         usdMax = data[i].price_usd;
//                     }
//                 }
//                 for (var i = 0; i < length; i++) {
//                     if ((data[i].last_updated +"000") >= startOfDay && (data[i].last_updated +"000") <= endOfDay) {
//                         newbody.push(data[i]);
//                     }
//                 }
//                 if (newbody.length != 0) {
//                     var min = "999999999999999";
//                     var max = "0";
//                     var min_inr = "999999999999999";
//                     var max_inr = "0";
//                     percent_change_24h = newbody[newbody.length - 1].percent_change_24h;
//                     percent_change_1h = newbody[newbody.length - 1].percent_change_1h;
//                     percent_change_7d = newbody[newbody.length - 1].percent_change_7d;
//                     OpenedAt = newbody[0].price_usd;
//                     for (var i = 0; i < newbody.length; i++) {
//                         if (newbody[i].price_usd < min) {
//                             min = newbody[i].price_usd
//                         } else if (newbody[i].price_usd > max) {
//                             max = newbody[i].price_usd;
//                         } else if (newbody[i].price_inr < min_inr) {
//                             min_inr = newbody[i].price_inr
//                         } else if (newbody[i].price_inr > max_inr) {
//                             max_inr = newbody[i].price_inr;
//                         }
//                     }
//                 }
//             }
// console.log(min,max,min_inr,max_inr,percent_change_24h,percent_change_1h,percent_change_7d);
//             res.status(200).send({
//                 //////CHANGE 0**********************************************************//////////////////////
//                 "Status": "2",
//                 "Message": "Success",
//                 "OpenedAt": OpenedAt,
//                 "MIN": usdMin,
//                 "MAX": usdMax,
//                 "price_usd_MIN": min,
//                 "price_usd_MAX": max,
//                 "price_inr_MIN": min_inr,
//                 "price_inr_MAX": max_inr,
//                 "percent_change_24h": percent_change_24h,
//                 "percent_change_1h": percent_change_1h,
//                 "percent_change_7d": percent_change_7d,
//                 "data": data
//             })
//         }
//     })
// });