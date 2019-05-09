var Service = require('../services');
////////// for fetching all the data in coinmarketdetail collection///////////////////////
const viewData = (callback) => {
    Service.coinDetailServices.viewData((err, newData) => {
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
//////////// for adding new data to coinmarketdetail collection //////////////////////////
const createDetails = function (data, callback) {
    console.log(data, 'data+++++===========');
    Service.coinDetailServices.saveDetails(data, (err, newData) => {
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
///////////// for fetching graphData on basis of 3months ,6months,weekly,daily///////////////////////
const fetchDataTimestamp = (data, callback) => {
    data.type = data.type.toUpperCase();
    var criteria;
    var date = new Date();
    const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
    var y = date.getFullYear();
    var m = date.getMonth();
    var first = date.getDate() - date.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    var firstDayOfMonth = Math.floor(new Date(y, m, 1));
    var sixMonths = date.setMonth(date.getMonth() + 6);
    var threeMonths = date.setMonth(date.getMonth() + 3);
    var lastDayOfMonth = Math.floor(new Date(y, m + 1, 0));
    var firstDayOfWeek = Math.floor(new Date(new Date().setDate(first)));
    var lastDayOfWeek = Math.floor(new Date(new Date().setDate(last)));
    var firstDayOfYear = Math.floor(new Date(new Date().getFullYear(), 0, 1));
    var lastDayOfYear = Math.floor(new Date(new Date().getFullYear(), 11, 31));
    var startOfDay = Math.floor(Date.now() / interval) * interval;
    var endOfDay = startOfDay + interval - 1; // 23:59:59:9999
    switch (data.type) {
        case "DAILY":
            criteria = {
                symbol: data.currencysymbol,
                updatedAt: {
                    $lte: endOfDay,
                    $gte: startOfDay
                }
            }
            break;
        case "WEEKLY":
            criteria = {
                symbol: data.currencysymbol,
                updatedAt: {
                    $lte: lastDayOfWeek,
                    $gte: firstDayOfWeek
                }
            }
            break;

        case "MONTHLY":
            criteria = {
                symbol: data.currencysymbol,
                updatedAt: {
                    $lte: lastDayOfMonth,
                    $gte: firstDayOfMonth
                }
            }
            break;
        case "THREEMONTHS":
            criteria = {
                symbol: data.currencysymbol,
                updatedAt: {
                    $lte: endOfDay,
                    $gte: threeMonths
                }
            }
            break;
        case "SIXMONTHS":
            criteria = {
                symbol: data.currencysymbol,
                updatedAt: {
                    $lte: endOfDay,
                    $gte: sixMonths
                }
            }
            break;

        case "YEARLY":
            criteria = {
                symbol: data.currencysymbol,
                updatedAt: {
                    $lte: lastDayOfYear,
                    $gte: firstDayOfYear
                }
            }
            break;

    }
    console.log(criteria, "===criteria=======================================");
    Service.cryptoServices.fetchGraphData(criteria, {}, {}, (err, newData) => {
        if (err) {
            if (err.code && err.code == 11000) {
                return callback(err.message);
            }
            return callback(err);
        } else {
            console.log("++++find HERE++++");
            return callback(null, newData);
        }
    })
}

const getFetchDataTimestamp = (data, callback) => {
    console.log(data.type, data.currencysymbol, `data=======`);
    data.type = data.type.toUpperCase();
    var criteria;
    var date = new Date();
    const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
    var y = date.getFullYear();
    var m = date.getMonth();
    var first = date.getDate() - date.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    var firstDayOfMonth = Math.floor(new Date(y, m, 1));
    var sixMonths = date.setMonth(date.getMonth() + 6);
    var threeMonths = date.setMonth(date.getMonth() + 3);
    var lastDayOfMonth = Math.floor(new Date(y, m + 1, 0));
    var firstDayOfWeek = Math.floor(new Date(new Date().setDate(first)));
    var lastDayOfWeek = Math.floor(new Date(new Date().setDate(last)));
    var firstDayOfYear = Math.floor(new Date(new Date().getFullYear(), 0, 1));
    var lastDayOfYear = Math.floor(new Date(new Date().getFullYear(), 11, 31));
    var startOfDay = Math.floor(Date.now() / interval) * interval;
    var endOfDay = startOfDay + interval - 1; // 23:59:59:9999
    switch (data.type) {
        case "DAILY":
        console.log(data.type, `INSIDE`);
             var criteria = {
                symbol: data.currencysymbol,
                updatedAt: {
                    $lte: endOfDay,
                    $gte: startOfDay
                }
            }
            break;
        case "WEEKLY":
        console.log(data.type, `INSIDE`);

           var criteria = {
                symbol: data.currencysymbol,
                updatedAt: {
                    $lte: lastDayOfWeek,
                    $gte: firstDayOfWeek
                }
            }
            break;

        case "MONTHLY":
        console.log(data.type, `INSIDE`);

            var criteria = {
                symbol: data.currencysymbol,
                updatedAt: {
                    $lte: lastDayOfMonth,
                    $gte: firstDayOfMonth
                }
            }
            break;
        case "THREEMONTHS":
        console.log(data.type, `INSIDE`);

            criteria = {
                symbol: data.currencysymbol,
                updatedAt: {
                    $lte: endOfDay,
                    $gte: threeMonths
                }
            }
            break;
        case "SIXMONTHS":
        console.log(data.type, `INSIDE`);

            var criteria = {
                symbol: data.currencysymbol,
                updatedAt: {
                    $lte: endOfDay,
                    $gte: sixMonths
                }
            }
            break;

        case "YEARLY":
        console.log(data.type, `INSIDE`);

            var criteria = {
                symbol: data.currencysymbol,
                updatedAt: {
                    $lte: lastDayOfYear,
                    $gte: firstDayOfYear
                }
            }
            break;

    }
    console.log(criteria, "===criteria=======================================");
    Service.cryptoServices.fetchGraphData(criteria, {}, {}, (err, newData) => {
        if (err) {
            if (err.code && err.code == 11000) {
                return callback(err.message);
            }
            return callback(err);
        } else {
            console.log("++++find HERE++++");
            return callback(null, newData);
        }
    })
}
module.exports = {
    fetchDataTimestamp: fetchDataTimestamp,
    getFetchDataTimestamp: getFetchDataTimestamp,
    viewData: viewData,
    createDetails: createDetails,

}


// const fetchDataTimestamp = function (data, callback) {
//     data.type = data.type.toUpperCase();
//     var criteria;
//     var date = new Date();
//     const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
//     var y = date.getFullYear();
//     var m = date.getMonth();
//     var first = date.getDate() - date.getDay(); // First day is the day of the month - the day of the week
//     var last = first + 6; // last day is the first day + 6
//     var firstDayOfMonth = Math.floor(new Date(y, m, 1));
//     var sixMonths = date.setMonth(date.getMonth() + 6);
//     var threeMonths = date.setMonth(date.getMonth() + 3);
//     var lastDayOfMonth = Math.floor(new Date(y, m + 1, 0));
//     var firstDayOfWeek = Math.floor(new Date(new Date().setDate(first)));
//     var lastDayOfWeek = Math.floor(new Date(new Date().setDate(last)));
//     var firstDayOfYear = Math.floor(new Date(new Date().getFullYear(), 0, 1));
//     var lastDayOfYear = Math.floor(new Date(new Date().getFullYear(), 11, 31));
//     var startOfDay = Math.floor(Date.now() / interval) * interval;
//     var endOfDay = startOfDay + interval - 1; // 23:59:59:9999
//     console.log("firstDayOfWeek", firstDayOfMonth);
//     console.log("lastDayOfWeek", lastDayOfWeek);

//     switch (data.type) {
//         case "DAILY":
//             criteria = {
//                 symbol: data.currencysymbol,
//                 last_updated: {
//                     $lte: endOfDay,
//                     $gte: startOfDay
//                 }
//             }
//             break;
//         case "WEEKLY":
//             criteria = {
//                 symbol: data.currencysymbol,
//                 last_updated: {
//                     $lte: lastDayOfWeek,
//                     $gte: firstDayOfWeek
//                 }
//             }
//             break;

//         case "MONTHLY":
//             criteria = {
//                 symbol: data.currencysymbol,
//                 last_updated: {
//                     $lte: lastDayOfMonth,
//                     $gte: firstDayOfMonth
//                 }
//             }
//             break;
//         case "THREEMONTHS":
//             criteria = {
//                 symbol: data.currencysymbol,
//                 last_updated: {
//                     $lte: endOfDay,
//                     $gte: threeMonths
//                 }
//             }
//             break;
//         case "SIXMONTHS":
//             criteria = {
//                 symbol: data.currencysymbol,
//                 last_updated: {
//                     $lte: endOfDay,
//                     $gte: sixMonths
//                 }
//             }
//             break;

//         case "YEARLY":
//             criteria = {
//                 symbol: data.currencysymbol,
//                 last_updated: {
//                     $lte: lastDayOfYear,
//                     $gte: firstDayOfYear
//                 }
//             }
//             break;

//     }
//     console.log(criteria, "===criteria=======================================");
//     Service.coinDetailServices.fetchDataTimestamp(criteria, {}, {}, function (err, newData) {
//         if (err) {
//             if (err.code && err.code == 11000) {
//                 return callback(err.message);
//             }
//             return callback(err);
//         } else {
//             console.log("++++find HERE++++");
//             return callback(null, newData);
//         }
//     })
// }