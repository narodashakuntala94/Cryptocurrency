    var Service = require('../services');
    var Config = require('../config');
    var path = "http://" + Config.ServerPath;
    var liveRates, transactionsToUpdate, updateCallback;
    const fetchOrders = (data, callback) => {
        var date = new Date();
        const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
        var y = date.getFullYear();
        var m = date.getMonth();
        var first = date.getDate() - date.getDay(); // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6
        var firstDayOfMonth = (new Date(y, m, 1)).toISOString();
        var threeMonths = new Date(date.setMonth(date.getMonth() + 3));
        var lastDayOfMonth = (new Date(y, m + 1, 0)).toISOString();
        var firstDayOfWeek = (new Date(new Date().setDate(first))).toISOString();
        var lastDayOfWeek = (new Date(new Date().setDate(last))).toISOString();
        var sixMonths = new Date(new Date().setMonth(new Date().getMonth() + 6));
        var lastDayOfYear = new Date(Math.floor(new Date(new Date().getFullYear(), 11, 31))).toISOString();
        var start = new Date();
        start.setHours(0, 0, 0, 0);
        var startOfDay = start.toISOString();
        var end = new Date();
        end.setHours(23, 59, 59, 999);
        var endOfDay = end.toISOString();
        console.log(firstDayOfMonth, lastDayOfMonth, firstDayOfWeek, lastDayOfWeek, endOfDay);
        // if(data.timePeriod == "DAILY") {
        //     var criteria = {
        //         dealType: data.dealType,
        //         userId: data.userId,
        //         updatedAt: {
        //             $lte: endOfDay,
        //             $gte: startOfDay
        //         }
        //     } 
        //     }else if(data.timePeriod == "WEEKLY"){
        //         var criteria = {
        //             dealType: data.dealType,
        //             userId: data.userId,
        //             updatedAt: {
        //                 $lte: lastDayOfWeek,
        //                 $gte: firstDayOfWeek
        //             }
        //         } 
        //     }else if(data.timePeriod == "MONTHLY"){
        //         var criteria = {
        //             dealType: data.dealType,
        //             userId: data.userId,
        //             updatedAt: {
        //                 $lte: lastDayOfMonth,
        //                 $gte: firstDayOfMonth
        //             }
        //         } 
        //     }else if(data.timePeriod == "THREEMONTHS"){ 
        //         var criteria = {
        //             dealType: data.dealType,
        //             userId: data.userId,
        //             updatedAt: {
        //                 $lte: endOfDay,
        //                 $gte: threeMonths
        //             }
        //         }
        // }else {
        //     var criteria = {
        //         dealType: data.dealType,
        //         userId: data.userId,
        //     }
        // }
        if (data.type) {
            if (data.dealType == "ALL") {
                if (data.timePeriod == "DAILY") {
                    var criteria = {
                        userId: data.userId,
                        type: data.type,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: startOfDay
                        }
                    }
                } else if (data.timePeriod == "WEEKLY") {
                    var criteria = {
                        userId: data.userId,
                        type: data.type,
                        createdAt: {
                            $lte: lastDayOfWeek,
                            $gte: firstDayOfWeek
                        }
                    }
                } else if (data.timePeriod == "MONTHLY") {
                    var criteria = {
                        userId: data.userId,
                        type: data.type,
                        createdAt: {
                            $lte: lastDayOfMonth,
                            $gte: firstDayOfMonth
                        }
                    }
                } else if (data.timePeriod == "THREEMONTHS") {
                    var criteria = {
                        userId: data.userId,
                        type: data.type,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: threeMonths
                        }
                    }
                } else if (data.timePeriod == "SIXMONTHS") {
                    var criteria = {
                        userId: data.userId,
                        type: data.type,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: sixMonths
                        }
                    }
                } else if (data.timePeriod == "YEARLY") {
                    var criteria = {
                        userId: data.userId,
                        type: data.type,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: lastDayOfYear
                        }
                    }
                } else {
                    var criteria = {
                        userId: data.userId,
                        type: data.type
                    }
                }
            } else {
                if (data.timePeriod == "DAILY") {
                    var criteria = {
                        dealType: data.dealType,
                        type: data.type,
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: startOfDay
                        }
                    }
                } else if (data.timePeriod == "WEEKLY") {
                    var criteria = {
                        dealType: data.dealType,
                        type: data.type,
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfWeek,
                            $gte: firstDayOfWeek
                        }
                    }
                } else if (data.timePeriod == "MONTHLY") {
                    var criteria = {
                        dealType: data.dealType,
                        type: data.type,
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfMonth,
                            $gte: firstDayOfMonth
                        }
                    }
                } else if (data.timePeriod == "THREEMONTHS") {
                    var criteria = {
                        dealType: data.dealType,
                        type: data.type,
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: threeMonths
                        }
                    }
                } else if (data.timePeriod == "SIXMONTHS") {
                    var criteria = {
                        dealType: data.dealType,
                        userId: data.userId,
                        type: data.type,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: sixMonths
                        }
                    }
                } else if (data.timePeriod == "YEARLY") {
                    var criteria = {
                        dealType: data.dealType,
                        userId: data.userId,
                        type: data.type,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: lastDayOfYear
                        }
                    }
                } else {
                    var criteria = {
                        dealType: data.dealType,
                        type: data.type,
                        userId: data.userId,
                    }
                }
            }
        } else if (data.status) {
            if (data.dealType == "ALL") {
                if (data.timePeriod == "DAILY") {
                    var criteria = {
                        userId: data.userId,
                        transactionStatus: data.status,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: startOfDay
                        }
                    }
                } else if (data.timePeriod == "WEEKLY") {
                    var criteria = {
                        userId: data.userId,
                        transactionStatus: data.status,
                        createdAt: {
                            $lte: lastDayOfWeek,
                            $gte: firstDayOfWeek
                        }
                    }
                } else if (data.timePeriod == "MONTHLY") {
                    var criteria = {
                        userId: data.userId,
                        transactionStatus: data.status,
                        createdAt: {
                            $lte: lastDayOfMonth,
                            $gte: firstDayOfMonth
                        }
                    }
                } else if (data.timePeriod == "THREEMONTHS") {
                    var criteria = {
                        userId: data.userId,
                        transactionStatus: data.status,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: threeMonths
                        }
                    }
                } else if (data.timePeriod == "SIXMONTHS") {
                    var criteria = {
                        userId: data.userId,
                        transactionStatus: data.status,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: sixMonths
                        }
                    }
                } else if (data.timePeriod == "YEARLY") {
                    var criteria = {
                        userId: data.userId,
                        transactionStatus: data.status,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: lastDayOfYear
                        }
                    }
                } else {
                    var criteria = {
                        userId: data.userId,
                        transactionStatus: data.status,
                    }
                }
            } else {
                if (data.timePeriod == "DAILY") {
                    var criteria = {
                        dealType: data.dealType,
                        transactionStatus: data.status,
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: startOfDay
                        }
                    }
                } else if (data.timePeriod == "WEEKLY") {
                    var criteria = {
                        dealType: data.dealType,
                        transactionStatus: data.status,
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfWeek,
                            $gte: firstDayOfWeek
                        }
                    }
                } else if (data.timePeriod == "MONTHLY") {
                    var criteria = {
                        dealType: data.dealType,
                        transactionStatus: data.status,
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfMonth,
                            $gte: firstDayOfMonth
                        }
                    }
                } else if (data.timePeriod == "THREEMONTHS") {
                    var criteria = {
                        dealType: data.dealType,
                        transactionStatus: data.status,
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: threeMonths
                        }
                    }
                } else if (data.timePeriod == "SIXMONTHS") {
                    var criteria = {
                        dealType: data.dealType,
                        userId: data.userId,
                        transactionStatus: data.status,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: sixMonths
                        }
                    }
                } else if (data.timePeriod == "YEARLY") {
                    var criteria = {
                        dealType: data.dealType,
                        userId: data.userId,
                        transactionStatus: data.status,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: lastDayOfYear
                        }
                    }
                } else {
                    var criteria = {
                        dealType: data.dealType,
                        transactionStatus: data.status,
                        userId: data.userId,
                    }
                }
            }
        } else if (data.status && data.type) {
            if (data.dealType == "ALL") {
                if (data.timePeriod == "DAILY") {
                    var criteria = {
                        userId: data.userId,
                        transactionStatus: data.status,
                        type: data.type,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: startOfDay
                        }
                    }
                } else if (data.timePeriod == "WEEKLY") {
                    var criteria = {
                        userId: data.userId,
                        transactionStatus: data.status,
                        type: data.type,
                        createdAt: {
                            $lte: lastDayOfWeek,
                            $gte: firstDayOfWeek
                        }
                    }
                } else if (data.timePeriod == "MONTHLY") {
                    var criteria = {
                        userId: data.userId,
                        transactionStatus: data.status,
                        type: data.type,
                        createdAt: {
                            $lte: lastDayOfMonth,
                            $gte: firstDayOfMonth
                        }
                    }
                } else if (data.timePeriod == "THREEMONTHS") {
                    var criteria = {
                        userId: data.userId,
                        transactionStatus: data.status,
                        type: data.type,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: threeMonths
                        }
                    }
                } else if (data.timePeriod == "SIXMONTHS") {
                    var criteria = {
                        type: data.type,
                        userId: data.userId,
                        transactionStatus: data.status,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: sixMonths
                        }
                    }
                } else if (data.timePeriod == "YEARLY") {
                    var criteria = {
                        type: data.type,
                        userId: data.userId,
                        transactionStatus: data.status,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: lastDayOfYear
                        }
                    }
                } else {
                    var criteria = {
                        userId: data.userId,
                        transactionStatus: data.status,
                        type: data.type,
                    }
                }
            } else {
                if (data.timePeriod == "DAILY") {
                    var criteria = {
                        dealType: data.dealType,
                        type: data.type,
                        transactionStatus: data.status,
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: startOfDay
                        }
                    }
                } else if (data.timePeriod == "WEEKLY") {
                    var criteria = {
                        dealType: data.dealType,
                        type: data.type,
                        transactionStatus: data.status,
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfWeek,
                            $gte: firstDayOfWeek
                        }
                    }
                } else if (data.timePeriod == "MONTHLY") {
                    var criteria = {
                        dealType: data.dealType,
                        type: data.type,
                        transactionStatus: data.status,
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfMonth,
                            $gte: firstDayOfMonth
                        }
                    }
                } else if (data.timePeriod == "THREEMONTHS") {
                    var criteria = {
                        dealType: data.dealType,
                        type: data.type,
                        transactionStatus: data.status,
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: threeMonths
                        }
                    }
                } else if (data.timePeriod == "SIXMONTHS") {
                    var criteria = {
                        dealType: data.dealType,
                        type: data.type,
                        userId: data.userId,
                        transactionStatus: data.status,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: sixMonths
                        }
                    }
                } else if (data.timePeriod == "YEARLY") {
                    var criteria = {
                        dealType: data.dealType,
                        type: data.type,
                        userId: data.userId,
                        transactionStatus: data.status,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: lastDayOfYear
                        }
                    }
                } else {
                    var criteria = {
                        dealType: data.dealType,
                        type: data.type,
                        transactionStatus: data.status,
                        userId: data.userId,
                    }
                }
            }
        } else if (data.symbol && data.buyFrom) {
            if (data.dealType == "ALL") {
                if (data.timePeriod == "DAILY") {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: startOfDay
                        }
                    }
                } else if (data.timePeriod == "WEEKLY") {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfWeek,
                            $gte: firstDayOfWeek
                        }
                    }
                } else if (data.timePeriod == "MONTHLY") {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfMonth,
                            $gte: firstDayOfMonth
                        }
                    }
                } else if (data.timePeriod == "THREEMONTHS") {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: threeMonths
                        }
                    }
                } else if (data.timePeriod == "SIXMONTHS") {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: sixMonths
                        }
                    }
                } else if (data.timePeriod == "YEARLY") {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: lastDayOfYear
                        }
                    }
                } else {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        userId: data.userId,
                    }
                }
            } else {
                if (data.timePeriod == "DAILY") {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        dealType: data.dealType,
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: startOfDay
                        }
                    }
                } else if (data.timePeriod == "WEEKLY") {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        dealType: data.dealType,
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfWeek,
                            $gte: firstDayOfWeek
                        }
                    }
                } else if (data.timePeriod == "MONTHLY") {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        dealType: data.dealType,
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfMonth,
                            $gte: firstDayOfMonth
                        }
                    }
                } else if (data.timePeriod == "THREEMONTHS") {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        dealType: data.dealType,
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: threeMonths
                        }
                    }
                } else if (data.timePeriod == "SIXMONTHS") {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        userId: data.userId,
                        dealType: data.dealType,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: sixMonths
                        }
                    }
                } else if (data.timePeriod == "YEARLY") {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        userId: data.userId,
                        dealType: data.dealType,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: lastDayOfYear
                        }
                    }
                } else {
                    var criteria = {
                        $or: [{
                            $and: [{
                                symbol: data.symbol
                            }, {
                                buyFrom: data.buyFrom
                            }],
                        }, {
                            $and: [{
                                symbol: data.buyFrom
                            }, {
                                buyFrom: data.symbol,
                            }],
                        }],
                        dealType: data.dealType,
                        userId: data.userId,
                    }
                }

            }
        } else {
            if (data.dealType == "ALL") {
                if (data.timePeriod == "DAILY") {
                    var criteria = {
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: startOfDay
                        }
                    }
                } else if (data.timePeriod == "WEEKLY") {
                    var criteria = {
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfWeek,
                            $gte: firstDayOfWeek
                        }
                    }
                } else if (data.timePeriod == "MONTHLY") {
                    var criteria = {
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfMonth,
                            $gte: firstDayOfMonth
                        }
                    }
                } else if (data.timePeriod == "THREEMONTHS") {
                    var criteria = {
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: threeMonths
                        }
                    }
                } else if (data.timePeriod == "SIXMONTHS") {
                    var criteria = {
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: sixMonths
                        }
                    }
                } else if (data.timePeriod == "YEARLY") {
                    var criteria = {
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: lastDayOfYear
                        }
                    }
                } else {
                    var criteria = {
                        userId: data.userId,
                    }
                }
            } else {
                if (data.timePeriod == "DAILY") {
                    var criteria = {
                        dealType: data.dealType,
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: startOfDay
                        }
                    }
                } else if (data.timePeriod == "WEEKLY") {
                    var criteria = {
                        dealType: data.dealType,
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfWeek,
                            $gte: firstDayOfWeek
                        }
                    }
                } else if (data.timePeriod == "MONTHLY") {
                    var criteria = {
                        dealType: data.dealType,
                        userId: data.userId,
                        createdAt: {
                            $lte: lastDayOfMonth,
                            $gte: firstDayOfMonth
                        }
                    }
                } else if (data.timePeriod == "THREEMONTHS") {
                    var criteria = {
                        dealType: data.dealType,
                        userId: data.userId,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: threeMonths
                        }
                    }
                } else if (data.timePeriod == "SIXMONTHS") {
                    var criteria = {
                        userId: data.userId,
                        dealType: data.dealType,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: sixMonths
                        }
                    }
                } else if (data.timePeriod == "YEARLY") {
                    var criteria = {
                        userId: data.userId,
                        dealType: data.dealType,
                        createdAt: {
                            $lte: endOfDay,
                            $gte: lastDayOfYear
                        }
                    }
                } else {
                    var criteria = {
                        dealType: data.dealType,
                        userId: data.userId,
                    }
                }

            }
        }
        var projection = {
            _id: 0,
        }
        Service.transactionServices.fetchTransaction(criteria, projection, {}, (err, newData) => {
            if (err) {
                if (err.code && err.code == 11000) {
                    return callback(err.message);
                }
                return callback(err);
            } else {
                console.log(newData.length, "NEWDATA");
                return callback(null, newData);
            }
        })
    }


    const fetchAllOrders = (data, callback) => {
        var criteria = {
            $or: [{
                $and: [{
                    symbol: data.symbol
                }, {
                    buyFrom: data.buyFrom
                }],
            }, {
                $and: [{
                    symbol: data.buyFrom
                }, {
                    buyFrom: data.symbol,
                }],
            }],
            dealType: data.dealType,
            type: data.type,
        }
        var projection = {
            _id: 0,
        }
        Service.transactionServices.fetchTransaction(criteria, projection, {}, (err, newData) => {
            if (err) {
                if (err.code && err.code == 11000) {
                    return callback(err.message);
                }
                return callback(err);
            } else {
                console.log(newData.length, "NEWDATA");
                return callback(null, newData);
            }
        })
    }
    const fetchPairTransaction = (data, callback) => {
        if (data.dealType) {
            if (data.transactionStatus == "OPEN") {
                var criteria = {
                    $or: [{
                        $and: [{
                            symbol: data.symbol
                        }, {
                            buyFrom: data.buyFrom
                        }],
                    }, {
                        $and: [{
                            symbol: data.buyFrom
                        }, {
                            buyFrom: data.symbol,
                        }],
                    }],
                    $or: [{
                        transactionStatus: "ACTIVE"
                    },{
                        transactionStatus: "PENDING"
                    }],
                    userId: data.userId,
                }
            } else {
                var criteria = {
                    $or: [{
                        $and: [{
                            symbol: data.symbol
                        }, {
                            buyFrom: data.buyFrom
                        }],
                    }, {
                        $and: [{
                            symbol: data.buyFrom
                        }, {
                            buyFrom: data.symbol,
                        }],
                    }],
                    transactionStatus: data.transactionStatus,
                    userId: data.userId,
                    dealType: data.dealType,
                }
            }
        } else {
            if (data.transactionStatus == "OPEN") {
                var criteria = {
                    $or: [{
                        $and: [{
                            symbol: data.symbol
                        }, {
                            buyFrom: data.buyFrom
                        }],
                    }, {
                        $and: [{
                            symbol: data.buyFrom
                        }, {
                            buyFrom: data.symbol,
                        }],
                    }],
                    $or: [{
                        transactionStatus: "ACTIVE"
                    }, {
                        transactionStatus: "PENDING"
                    }],
                    userId: data.userId,
                }
            } else {
                var criteria = {
                    $or: [{
                        $and: [{
                            symbol: data.symbol
                        }, {
                            buyFrom: data.buyFrom
                        }],
                    }, {
                        $and: [{
                            symbol: data.buyFrom
                        }, {
                            buyFrom: data.symbol,
                        }],
                    }],
                    transactionStatus: data.transactionStatus,
                    userId: data.userId,
                }
            }
        }
        Service.transactionServices.fetchTransaction(criteria, {}, {}, (err, newData) => {
            if (err) {
                if (err.code && err.code == 11000) {
                    return callback(err.message);
                }
                return callback(err);
            } else {
                console.log(newData.length, "NEWDATA");
                return callback(null, newData);
            }
        })
    }
    const fetchBuySellTransaction = (data, callback) => {
        if (data.type == "BUY") {
            var criteria = {
                type: data.type,
                symbol: data.symbol,
                dealType: {
                    $ne: "MARKET"
                }
            }
        } else {
            var criteria = {
                type: data.type,
                buyFrom: data.symbol,
                dealType: {
                    $ne: "MARKET"
                }
            }
        }
        Service.transactionServices.fetchTransaction(criteria, {}, {}, (err, buySellData) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, buySellData)
            }
        })
    }
    const fetchTransaction = (data, callback) => {
        console.log(data, "DATA=============================================================================DATA")
        if (data.symbol) {
            var criteria = {
                $and: [{
                        $or: [{
                            receiverUserId: data.userId
                        }, {
                            userId: data.userId
                        }]
                    },
                    {
                        $or: [{
                            symbol: data.symbol
                        }, {
                            buyFrom: data.symbol,
                        }],
                    }
                ]
            }
        } else if (data.type) {
            if (data.type == "ALL") {
                if (data.specificSymbol) {
                    var criteria = {
                        $and: [{
                                $or: [{
                                    receiverUserId: data.userId
                                }, {
                                    userId: data.userId
                                }]
                            },
                            {
                                $or: [{
                                    type: "DEPOSIT"
                                }, {
                                    type: "WITHDRAW",
                                }],
                            }
                        ],
                        symbol: data.specificSymbol
                    }
                } else {
                    var criteria = {
                        $and: [{
                                $or: [{
                                    receiverUserId: data.userId
                                }, {
                                    userId: data.userId
                                }]
                            },
                            {
                                $or: [{
                                    type: "DEPOSIT"
                                }, {
                                    type: "WITHDRAW",
                                }],
                            }
                        ]
                    }
                }
            } else {
                var criteria = {
                    $or: [{
                        receiverUserId: data.userId
                    }, {
                        userId: data.userId
                    }],
                    type: data.type,
                }
            }
        } else if (data.transactionStatus && data.symbol) {
            var criteria = {
                $and: [{
                    $or: [{
                        receiverUserId: data.userId
                    }, {
                        userId: data.userId
                    }],
                }, {
                    $or: [{
                        symbol: data.symbol
                    }, {
                        buyFrom: data.symbol,
                    }],
                }],
                transactionStatus: data.transactionStatus,
            }
        } else if (data.transactionStatus) {
            var criteria = {
                $or: [{
                    receiverUserId: data.userId
                }, {
                    userId: data.userId
                }],
                transactionStatus: data.transactionStatus,
            }
        } else if (data.transactionId) {
            var criteria = {
                transactionId: data.transactionId,
            }
        } else if (data.limitStatus) {
            data.limitStatus = data.limitStatus.toUpperCase();
            if (data.limitStatus == "CLOSED") {
                var criteria = {
                    $and: [{
                        $or: [{
                            receiverUserId: data.userId
                        }, {
                            userId: data.userId
                        }],
                    }, {
                        $or: [{
                            type: "BUY"
                        }, {
                            type: "SELL"
                        }]
                    }],
                    transactionStatus: "CLOSED",
                }
            } else {
                var criteria = {
                    $and: [{
                            $or: [{
                                receiverUserId: data.userId
                            }, {
                                userId: data.userId
                            }],
                        },
                        {
                            $or: [{
                                type: "BUY"
                            }, {
                                type: "SELL"
                            }]
                        }
                    ],
                    limitStatus: data.limitStatus,
                    transactionStatus: {
                        $ne: "CLOSED"
                    },
                }
            }
        } else if (data.emailId) {
            var criteria = {
                recipientEmail: data.emailId,
            }
        } else {
            var criteria = {
                $or: [{
                    receiverUserId: data.userId
                }, {
                    userId: data.userId
                }]
            }
        }
        Service.transactionServices.fetchTransaction(criteria, {}, {}, (err, newData) => {
            if (err) {
                if (err.code && err.code == 11000) {
                    return callback(err.message);
                }
                return callback(err);
            } else {
                if (data.transactionId) {
                    if (newData[0].type == "SELL") {
                        var criteria = {
                            symbol: newData[0].buyFrom
                        }
                        console.log("SELL", newData[0].buyFrom);
                    } else if (newData[0].type == "BUY") {
                        var criteria = {
                            symbol: newData[0].symbol
                        }
                        console.log("BUY", newData[0].symbol);
                    }

                    Service.cryptoServices.fetchOneCryptoData(criteria, {}, {}, (err, fetchedData) => {
                        if (err) {
                            return err.message;
                        } else {
                            if (newData[0].transactionStatus == "ACTIVE") {
                                if (newData[0].type == "BUY") {
                                    var profitOrLoss = (fetchedData.sellingPriceUsd - Number(newData[0].buySellRate)) * Number(newData[0].quantity);
                                    // console.log(typeof fetchedData.sellingPriceUsd, "+fetchedData.sellingPriceUsd++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                                    // console.log(typeof newData[0].buySellRate, "newData[0].buySellRate+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                                    // console.log(typeof newData[0].quantity, "++newData[0].quantity+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                                    // console.log(typeof profitOrLoss, "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                                    // console.log(profitOrLoss, "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                                } else if (newData[0].type == "SELL") {
                                    var profitOrLoss = (Number(newData[0].buySellRate) - fetchedData.buyingPriceUsd) * Number(newData[0].buyFromQuantity);;
                                    // console.log(typeof fetchedData.sellingPriceUsd, "+fetchedData.sellingPriceUsd++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                                    // console.log(typeof newData[0].buySellRate, "newData[0].buySellRate+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                                    // console.log( newData[0].quantity, "++newData[0].quantity+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                                    // console.log(profitOrLoss, "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                                    // console.log(typeof profitOrLoss, "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

                                }
                                var updateCriteria = {
                                    transactionId: data.transactionId
                                }
                                var dataToSet = {
                                    currentRate: fetchedData.buyingPriceUsd,
                                    profitOrLoss: profitOrLoss,
                                }
                                Service.transactionServices.updateTransaction(updateCriteria, dataToSet, {}, (err, updatedData) => {
                                    if (err) {
                                        return err.message;
                                    } else {
                                        var transactionCritereia = {
                                            transactionId: data.transactionId
                                        }
                                        Service.transactionServices.fetchTransaction(transactionCritereia, {}, {}, (err, transactionData) => {
                                            if (err) {
                                                return err.message;
                                            } else {
                                                return callback(null, transactionData);
                                            }
                                        })
                                    }
                                })
                            } else {
                                var updateCriteria = {
                                    transactionId: data.transactionId
                                }
                                var dataToSet = {
                                    currentRate: fetchedData.buyingPriceUsd,
                                }
                                Service.transactionServices.updateTransaction(updateCriteria, dataToSet, {}, (err, updatedData) => {
                                    if (err) {
                                        return err.message;
                                    } else {
                                        var transactionCritereia = {
                                            transactionId: data.transactionId
                                        }
                                        Service.transactionServices.fetchTransaction(transactionCritereia, {}, {}, (err, transactionData) => {
                                            if (err) {
                                                return err.message;
                                            } else {
                                                return callback(null, transactionData);
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                } else {
                    return callback(null, newData);
                }
            }
        })
    }
    const createTransaction = (data, callback) => {
        if (data.type == "BUY") {
            var criteria = {
                symbol: data.symbol
            }
            Service.cryptoServices.fetchOneCryptoData(criteria, {}, {}, (err, updatedData) => {
                if (err) {
                    return err.message;
                } else {
                    var uniqueId = Math.random().toString(36).substr(2, 16) + Math.random().toString(36).substr(2, 16);
                    data.createdAt = new Date().toISOString();
                    data.updatedAt = new Date().toISOString();
                    data.transactionId = uniqueId;
                    if (data.refTransactionId) {
                        data.refTransactionId = data.refTransactionId;
                    } else {
                        data.refTransactionId = uniqueId;
                    }
                    data.userId = data.userId;
                    data.amount = data.amount;
                    data.receiverUserId = data.receiverUserId;
                    data.finalAmount = data.amount;
                    data.recipientAddress = data.recipientAddress;
                    data.senderAddress = data.senderAddress;
                    data.type = data.type;
                    data.quantity = data.amount,
                        data.recipientEmail = data.recipientEmail;
                    data.paymentProviderId = "NA";
                    data.fees = data.fees;
                    data.currentRate = "";
                    if (data.transactionStatus) {
                        data.transactionStatus = data.transactionStatus;
                    } else {
                        data.transactionStatus = "ACTIVE";
                    }
                    data.symbol = data.symbol;
                    data.margin = data.margin;
                    data.limit_level = "";
                    data.stop_loss = "";
                    data.stop_loss_amt = "";
                    data.stop_loss_rate = "";
                    data.stop_loss_percentage = "";
                    data.stop_profit = "";
                    data.stop_profit_amt = "";
                    data.stop_profit_rate = "";
                    data.stop_profit_percentage = "";
                    data.name = updatedData.name;
                    data.buySellRate = updatedData.buyingPriceUsd;
                    data.profitOrLoss = 0;
                    data.img = updatedData.img;
                    data.amount = data.amount;
                    data.contractTime = data.contractTime;
                    data.contractEndTime = data.contractEndTime;
                    data.bitgoTransactionId = data.bitgoTransactionId;
                    data.bitgoTransaction = data.bitgoTransaction;
                    data.bitgoTransactionStatus = data.bitgoTransactionStatus;
                    data.buyFromQuantity = data.buyFromQuantity;
                    data.link = "";
                    Service.transactionServices.saveTransactionDetail(data, (err, Data) => {
                        if (err) {
                            return callback(err);
                        } else {
                            return callback(null, Data)
                        }
                    })
                }
            })
        } else if (data.type == "SELL") {
            var criteria = {
                symbol: data.buyFrom
            }
            Service.cryptoServices.fetchOneCryptoData(criteria, {}, {}, (err, updatedData) => {
                if (err) {
                    return err.message;
                } else {
                    var uniqueId = Math.random().toString(36).substr(2, 16) + Math.random().toString(36).substr(2, 16);
                    data.createdAt = new Date().toISOString();
                    data.updatedAt = new Date().toISOString();
                    data.transactionId = uniqueId;
                    data.refTransactionId = uniqueId;
                    data.userId = data.userId;
                    data.amount = data.amount;
                    data.receiverUserId = data.receiverUserId;
                    data.finalAmount = data.amount
                    data.recipientAddress = data.recipientAddress;
                    data.senderAddress = data.senderAddress;
                    data.type = data.type;
                    data.quantity = data.amount,
                        data.recipientEmail = data.recipientEmail;
                    data.paymentProviderId = "NA";
                    data.fees = data.fees;
                    data.currentRate = "";
                    if (data.transactionStatus) {
                        data.transactionStatus = data.transactionStatus;
                    } else {
                        data.transactionStatus = "ACTIVE";
                    }
                    data.symbol = data.symbol;
                    data.margin = "";
                    data.limit_level = "";
                    data.stop_loss = "";
                    data.stop_loss_amt = "";
                    data.stop_loss_rate = "";
                    data.stop_loss_percentage = "";
                    data.stop_profit = "";
                    data.stop_profit_amt = "";
                    data.stop_profit_rate = "";
                    data.stop_profit_percentage = "";
                    data.name = updatedData.name;
                    data.buySellRate = updatedData.sellingPriceUsd;
                    data.profitOrLoss = 0;
                    data.img = updatedData.img;
                    data.amount = data.amount;
                    data.contractTime = "";
                    data.contractEndTime = "";
                    data.bitgoTransactionId = data.bitgoTransactionId;
                    data.bitgoTransaction = data.bitgoTransaction;
                    data.bitgoTransactionStatus = data.bitgoTransactionStatus;
                    data.buyFromQuantity = data.buyFromQuantity;
                    data.link = "";
                    Service.transactionServices.saveTransactionDetail(data, (err, Data) => {
                        if (err) {
                            return callback(err);
                        } else {
                            return callback(null, Data)
                        }
                    })
                }
            })
        }
    }
    const addMoney = (data, callback) => {
        console.log("inside");
        var DataRecieved;
        var isUSDorINR;
        if (data.symbol == "INR") {
            isUSDorINR = "1";
        } else if (data.symbol == "USD") {
            isUSDorINR = "1";
        } else {
            isUSDorINR = "0";
        }
        if (isUSDorINR == "0") {
            var fetchCriteria = {
                symbol: data.symbol
            };
            Service.cryptoServices.fetchOneCryptoData(fetchCriteria, {}, {}, (err, updatedData) => {
                if (err) {
                    return err.message;
                } else {
                    if (data.paymentProviderId) {
                        data.paymentProviderId = data.paymentProviderId.toUpperCase();
                    }
                    var uniqueId = Math.random().toString(36).substr(2, 16) + Math.random().toString(36).substr(2, 16);
                    var uniqueIdtemp = Math.random().toString(36).substr(2, 26);
                    data.createdAt = new Date().toISOString();
                    data.updatedAt = new Date().toISOString();
                    data.transactionId = uniqueId;
                    data.refTransactionId = uniqueId;
                    data.userId = data.userId;
                    data.recipientAddress = uniqueId + uniqueIdtemp;
                    data.senderAddress = uniqueIdtemp + uniqueId;
                    data.type = data.type;
                    data.recipientEmail = data.userId + "@test.com";
                    data.paymentProviderId = "NA";
                    data.fees = "";
                    data.currencyType = "CRYPTO";
                    data.transactionStatus = "ACTIVE";
                    data.symbol = data.symbol;
                    data.margin = "";
                    data.limit_level = "";
                    data.quantity = "",
                        data.stop_loss = "";
                    data.currentRate = "";
                    data.stop_loss_amt = "";
                    data.stop_loss_rate = "";
                    data.stop_loss_percentage = "";
                    data.stop_profit = "";
                    data.stop_profit_amt = "";
                    data.stop_profit_rate = "";
                    data.contractTime = "";
                    data.contractEndTime = "";
                    data.stop_profit_percentage = "";
                    data.name = updatedData.name;
                    data.buySellRate = updatedData.buyingPriceBtc;
                    data.profitOrLoss = "";
                    data.img = updatedData.img;
                    data.buyFromQuantity = "";
                    data.link = "";
                    Service.transactionServices.saveTransactionDetail(data, (err, newData) => {
                        console.log(err, newData);
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
        } else {
            if (data.symbol == "INR") {
                data.profitOrLoss = "0";
                data.img = path + "/INR.png";
            } else if (data.symbol == "USD") {
                data.profitOrLoss = "0";
                data.img = path + "/usd.png";
            }
            if (data.paymentProviderId) {
                data.paymentProviderId = data.paymentProviderId.toUpperCase();
            }
            var uniqueId = Math.random().toString(36).substr(2, 16) + Math.random().toString(36).substr(2, 16);
            var uniqueIdtemp = Math.random().toString(36).substr(2, 26);
            data.createdAt = new Date.toISOString();
            data.updatedAt = new Date.toISOString();
            data.transactionId = uniqueId;
            data.refTransactionId = uniqueId;
            data.userId = data.userId;
            data.recipientAddress = uniqueId + uniqueIdtemp;
            data.senderAddress = uniqueIdtemp + uniqueId;
            data.type = data.type;
            data.recipientEmail = data.userId + "@test.com";
            data.paymentProviderId = "NA";
            data.fees = "";
            data.quantity = "",
                data.transactionStatus = "ACTIVE";
            data.currencyType = "NON CRYPTO";
            data.margin = "";
            data.limit_level = "";
            data.stop_loss = "";
            data.currentRate = "";
            data.stop_loss_amt = "";
            data.stop_loss_rate = "";
            data.stop_loss_percentage = "";
            data.stop_profit = "";
            data.stop_profit_amt = "";
            data.stop_profit_rate = "";
            data.stop_profit_percentage = "";
            data.name = data.symbol;
            data.contractTime = "";
            data.contractEndTime = "";
            data.buySellRate = "";
            data.buyFromQuantity = "";
            data.link = "";
            switch (data.paymentProviderId) {
                case "PAYUMONEY":
                    data.fees = .019
                    data.finalAmount = parseInt(data.amount) + (data.amount * data.fees);
                    break;
                case "NEFT":
                    data.finalAmount = data.amount;
                    break;
                case "IMPS":
                    data.finalAmount = data.amount;
                    break;
                case "CHEQUE":
                    data.finalAmount = data.amount;
                    break;
                default:
                    data.finalAmount = data.amount;
                    break;

            }
            console.log(data, "=========================data=========================data")
            Service.transactionServices.saveTransactionDetail(data, (err, newData) => {
                console.log(err, newData);
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
    }
    const updateTransaction = (data, callback) => {
        var criteria = {
            transactionId: data.transactionId
        };
        var options = {};
        if (data.case == "STOPLOSS") {
            var dataToSet = {
                transactionStatus: data.transactionStatus,
                updatedAt: data.updatedAt,
            };
        } else {
            var dataToSet = {
                amount: data.amount,
                receiverUserId: data.receiverUserId,
                recipientAddress: data.recipientAddress,
                senderAddress: data.senderAddress,
                transactionStatus: data.transactionStatus,
                limitRate: data.limitRate,
                updatedAt: data.updatedAt,
                bitgoTransactionId: data.bitgoTransactionId,
                bitgoTransaction: data.bitgoTransaction,
                bitgoTransactionStatus: data.bitgoTransactionStatus,
                finalAmount: data.finalAmount,
            };
        }
       
        Service.transactionServices.updateTransaction(criteria, dataToSet, options, (err, updatedData) => {
            if (err) {
                return err.message;
            } else {
                console.log(updatedData);
                return callback(null, updatedData);
            }
        })
    }

    const fetchTransactionFromEmail = (data, callback) => {
        var criteria = {
            recipientEmail: data.emailId,
        }
        Service.transactionServices.fetchTransaction(criteria, {}, {}, (err, updatedData) => {
            if (err) {
                return err.message;
            } else {
                console.log(updatedData);
                return callback(null, updatedData);
            }
        })
    }

    const updateTransactionCron = (callback) => {
        var criteria = {
            transactionStatus: "ACTIVE",
        };
        Service.transactionServices.fetchTransaction(criteria, {}, {}, (err, updatedData) => {
            if (err) {
                return err.message;
            } else {
                console.log(updatedData.length, updatedData);
                transactionsToUpdate = updatedData;
                Service.cryptoServices.fetchUpdatedCryptoRates((err, Data) => {
                    if (err) {
                        if (err.code && err.code == 11000) {
                            return (err.message);
                        }
                        return err;
                    } else {
                        liveRates = Data;
                        for (var i = 0; i < liveRates.length; i++) {
                            for (var j = 0; j < transactionsToUpdate.length; j++) {
                                var cronJob = cronFunction(i);
                                var trmpry = cronJob(j);
                                console.log("**********&&&&&&&&&&&***********");
                            }
                            if (i == 99) {
                                console.log("OUT FROM LOOP");
                                return callback(null, {
                                    "MESSAGE": "LOOP COMPLETE"
                                });
                            }
                        }

                    }
                })
            }
        })
    }
    const cronFunction = function cron(i) {
        const myfunction = (j) => {
            if (transactionsToUpdate[j].type == "BUY") {
                console.log("AAYA");
                if (liveRates[i].symbol == transactionsToUpdate[j].symbol) {
                    var profitOrLoss = (liveRates[i].buyingPriceUsd - transactionsToUpdate[j].buySellRate) * transactionsToUpdate[j].quantity
                    console.log(`liveRates[i].buyingPriceUsd`, liveRates[i].buyingPriceUsd);
                    console.log(`transactionsToUpdate[j].buySellRate`, transactionsToUpdate[j].buySellRate);
                    console.log(`transactionsToUpdate[j].quantity`, transactionsToUpdate[j].quantity);
                    var updateCriteria = {
                        transactionId: transactionsToUpdate[j].transactionId,
                    }
                    var dataToSet = {
                        profitOrLoss: profitOrLoss,
                    }
                    Service.transactionServices.updateTransaction(updateCriteria, dataToSet, {}, (err, updatedData) => {
                        if (err) {
                            return err.message;
                        } else {
                            console.log("DATA UPDATED", updatedData);
                            updateCallback = updatedData;
                        }
                    })
                }
            } else if (transactionsToUpdate[j].type == "SELL") {
                if (liveRates[i].symbol == transactionsToUpdate[j].buyFrom) {
                    var profitOrLoss = (transactionsToUpdate[j].buySellRate - liveRates[i].sellingPriceUsd) * transactionsToUpdate[j].buyFromQuantity
                    var updateCriteria = {
                        transactionId: transactionsToUpdate[j].transactionId,
                    }
                    var dataToSet = {
                        profitOrLoss: profitOrLoss,
                    }
                    console.log(`transactionsToUpdate[j].buySellRate`, transactionsToUpdate[j].buySellRate);
                    console.log(`liveRates[i].sellingPriceUsd`, liveRates[i].sellingPriceUsd);
                    console.log(`transactionsToUpdate[j].buyFromQuantity`, transactionsToUpdate[j].buyFromQuantity);
                    Service.transactionServices.updateTransaction(updateCriteria, dataToSet, {}, (err, updatedData) => {
                        if (err) {
                            return err.message;
                        } else {
                            console.log("DATA UPDATED", updatedData);
                            updateCallback = updatedData;
                        }
                    })
                }
            }
            return updateCallback;
        }
        return myfunction;
    }
    const erc20Transaction = (data, callback) => {
        switch (data.symbol) {
            case "NEO":
                var category = "NEO";
                break;
            case "GAS":
                var category = "NEO";
                break;
        }
        var fetchCriteria = {
            symbol: data.symbol
        }
        Service.cryptoServices.fetchOneCryptoData(fetchCriteria, {}, {}, (err, updatedData) => {
            if (err) {
                return err.message;
            } else {
                if (category == "NEO") {
                    var neon_js = require('@cityofzion/neon-js')
                    var wallet = neon_js.wallet;
                    var api = neon_js.api;
                    var Neon = neon_js.default;
                    if (data.symbol == "NEO") {
                        var intent = api.makeIntent({
                            NEO: data.amount
                        }, data.recieverAddress)
                    } else if (data.symbol == "GAS") {
                        var intent = api.makeIntent({
                            GAS: data.amount
                        }, data.recieverAddress)
                    }
                    console.log("INTENT:", intent);
                    const config = {
                        net: 'TestNet',
                        address: 'AXVDDRWLbqQ22ACoNV9QRsxEjbk8uFsptg',
                        privateKey: '8043416930fe179b0f53802ff6aaf4945e4e0e70bc5d0cb66f3dc1106b65e8f0',
                        intents: intent
                    }
                    api.sendAsset(config)
                        .then(config => {
                            console.log(config.response, "TXID");
                            var transactionData = {};
                            var uniqueId = Math.random().toString(36).substr(2, 16) + Math.random().toString(36).substr(2, 16);
                            var uniqueIdtemp = Math.random().toString(36).substr(2, 26);
                            transactionData.createdAt = new Date().toISOString();
                            transactionData.updatedAt = new Date().toISOString();
                            transactionData.transactionId = uniqueId;
                            transactionData.bitgoTransactionId = config.response.txid;
                            transactionData.userId = data.userId;
                            if (data.refTransactionId) {
                                transactionData.refTransactionId = data.refTransactionId;
                            } else {
                                transactionData.refTransactionId = uniqueId;
                            }
                            transactionData.dealType = "";
                            transactionData.buyFrom = "";
                            transactionData.currencyType = "";
                            transactionData.stopLossRate = "";
                            transactionData.stopProfitRate = "";
                            transactionData.limitStatus = "";
                            transactionData.limitRate = "";
                            transactionData.limitlevel = "";
                            transactionData.amount = data.amount;
                            transactionData.receiverUserId = "";
                            transactionData.finalAmount = data.amount;
                            transactionData.recipientAddress = data.recieverAddress;
                            transactionData.senderAddress = "";
                            transactionData.type = data.type;
                            transactionData.quantity = data.amount,
                                transactionData.recipientEmail = data.emailId;
                            transactionData.paymentProviderId = "NA";
                            transactionData.fees = data.fees;
                            transactionData.currentRate = "";
                            transactionData.transactionStatus = "CLOSED";
                            transactionData.symbol = data.symbol;
                            transactionData.margin = "";
                            transactionData.limit_level = "";
                            transactionData.stop_loss = "";
                            transactionData.stop_loss_amt = "";
                            transactionData.stop_loss_rate = "";
                            transactionData.stop_loss_percentage = "";
                            transactionData.stop_profit = "";
                            transactionData.stop_profit_amt = "";
                            transactionData.stop_profit_rate = "";
                            transactionData.stop_profit_percentage = "";
                            if (updatedData == null) {
                                transactionData.name = data.symbol;
                                transactionData.buySellRate = "NA";
                                transactionData.img = "NA";
                            } else {
                                transactionData.name = updatedData.name;
                                transactionData.buySellRate = updatedData.buyingPriceUsd;
                                transactionData.img = updatedData.img;
                            }
                            transactionData.profitOrLoss = "";
                            transactionData.contractTime = "";
                            transactionData.contractEndTime = "";
                            transactionData.bitgoTransaction = "";
                            transactionData.bitgoTransactionStatus = "";
                            transactionData.buyFromQuantity = "";
                            transactionData.link = "https://neoscan-testnet.io/transaction/" + config.response.txid;
                            Service.transactionServices.saveTransactionDetail(transactionData, function (err, savedData) {
                                if (err) {
                                    return callback(err);
                                } else {
                                    return callback(null, savedData)
                                }
                            })
                        })
                        .catch(config => {
                            console.log(config)
                            return callback(config);
                        })
                } else {
                    var publicAddress = "0x24a60d3abe605a0ffc2852863eba5e517e5a4fc4";
                    var privateKey = '5769a11a142f7975492e7d36987d77c86d4c2c385b9b1a6f859f54e9328abb9c';
                    console.log(privateKey);
                    console.log(publicAddress);
                    var Web3 = require('web3');
                    var EthTx = require('ethereumjs-tx');
                    // var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/Fwp5nmX6Ze5FouVcBlHr'));
                    var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/Fwp5nmX6Ze5FouVcBlHr'));
                    console.log(web3.version.network, "network=====================")
                    if (web3.version.network != 1) {
                        if (web3.version.network == 4) {
                            console.log("Connected to the RINKEBY NETWORK FOR TESTING PURPOSE.");
                        } else {
                            console.error("Wrong network detected. Please switch to the Mainnet.");
                        }
                    } else {
                        console.log("Connected to the Mainnet.");
                    }
                    var contractAbi = [{
                            "constant": true,
                            "inputs": [],
                            "name": "name",
                            "outputs": [{
                                "name": "",
                                "type": "string"
                            }],
                            "payable": false,
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "constant": true,
                            "inputs": [],
                            "name": "totalSupply",
                            "outputs": [{
                                "name": "",
                                "type": "uint256"
                            }],
                            "payable": false,
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "constant": true,
                            "inputs": [],
                            "name": "decimals",
                            "outputs": [{
                                "name": "",
                                "type": "uint8"
                            }],
                            "payable": false,
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "constant": true,
                            "inputs": [],
                            "name": "standard",
                            "outputs": [{
                                "name": "",
                                "type": "string"
                            }],
                            "payable": false,
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "constant": true,
                            "inputs": [{
                                "name": "",
                                "type": "address"
                            }],
                            "name": "balanceOf",
                            "outputs": [{
                                "name": "",
                                "type": "uint256"
                            }],
                            "payable": false,
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "constant": true,
                            "inputs": [],
                            "name": "symbol",
                            "outputs": [{
                                "name": "",
                                "type": "string"
                            }],
                            "payable": false,
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "constant": true,
                            "inputs": [{
                                    "name": "",
                                    "type": "address"
                                },
                                {
                                    "name": "",
                                    "type": "address"
                                }
                            ],
                            "name": "allowance",
                            "outputs": [{
                                "name": "",
                                "type": "uint256"
                            }],
                            "payable": false,
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "inputs": [{
                                "name": "_initialSupply",
                                "type": "uint256"
                            }],
                            "payable": false,
                            "stateMutability": "nonpayable",
                            "type": "constructor"
                        },
                        {
                            "anonymous": false,
                            "inputs": [{
                                    "indexed": true,
                                    "name": "_from",
                                    "type": "address"
                                },
                                {
                                    "indexed": true,
                                    "name": "_to",
                                    "type": "address"
                                },
                                {
                                    "indexed": false,
                                    "name": "_value",
                                    "type": "uint256"
                                }
                            ],
                            "name": "Transfer",
                            "type": "event"
                        },
                        {
                            "anonymous": false,
                            "inputs": [{
                                    "indexed": true,
                                    "name": "_owner",
                                    "type": "address"
                                },
                                {
                                    "indexed": true,
                                    "name": "_spender",
                                    "type": "address"
                                },
                                {
                                    "indexed": false,
                                    "name": "_value",
                                    "type": "uint256"
                                }
                            ],
                            "name": "Approval",
                            "type": "event"
                        },
                        {
                            "constant": false,
                            "inputs": [{
                                    "name": "_to",
                                    "type": "address"
                                },
                                {
                                    "name": "_value",
                                    "type": "uint256"
                                }
                            ],
                            "name": "transfer",
                            "outputs": [{
                                "name": "success",
                                "type": "bool"
                            }],
                            "payable": false,
                            "stateMutability": "nonpayable",
                            "type": "function"
                        },
                        {
                            "constant": false,
                            "inputs": [{
                                    "name": "_spender",
                                    "type": "address"
                                },
                                {
                                    "name": "_value",
                                    "type": "uint256"
                                }
                            ],
                            "name": "approve",
                            "outputs": [{
                                "name": "success",
                                "type": "bool"
                            }],
                            "payable": false,
                            "stateMutability": "nonpayable",
                            "type": "function"
                        },
                        {
                            "constant": false,
                            "inputs": [{
                                    "name": "_from",
                                    "type": "address"
                                },
                                {
                                    "name": "_to",
                                    "type": "address"
                                },
                                {
                                    "name": "_value",
                                    "type": "uint256"
                                }
                            ],
                            "name": "transferFrom",
                            "outputs": [{
                                "name": "success",
                                "type": "bool"
                            }],
                            "payable": false,
                            "stateMutability": "nonpayable",
                            "type": "function"
                        }
                    ];
                    // var contract = web3.eth.contract(contractAbi);
                    var contractAddress = '0xe2b2f3681508c01cfde26f1cba1513a3e04fc56c';
                    //var contractAddress = "0x873c897f5eaa2d04d0eb5d4ff7548248b0bbcf5a";
                    //var userStoreInstance = contract.at(contractAddress);
                    var toAddress = data.recieverAddress;
                    var token = data.amount + '000000000000000000';
                    console.log(token, "AMOUNT");

                    function callMyFunc() {
                        var _ = require('lodash');
                        var SolidityFunction = require('web3/lib/web3/function');
                        var solidityFunction = new SolidityFunction('', _.find(contractAbi, {
                            name: 'transfer'
                        }), '');
                        var data = solidityFunction.toPayload([toAddress, token]).data;
                        var signedTx = signTx(publicAddress, contractAddress, '0x00', data, privateKey);
                        var txnHash = sendRawTx(publicAddress, signedTx);
                        return txnHash;
                    }
                    const txParams = {
                        nonce: '0x00',
                        gasPrice: '0x1428b81aa',
                        gasLimit: '0x271099',
                        to: '0x0000000000000000000000000000000000000000',
                        value: '0x00',
                        data: '0x00',
                        chainId: 4,
                    }

                    function getTxCount(pubAdd) {
                        return web3.eth.getTransactionCount(pubAdd);
                    }

                    function signTx(from, to, value, data, privKey) {
                        txParams.nonce = getTxCount(from);
                        txParams.to = to;
                        txParams.value = value;
                        txParams.data = data;
                        var privateKey1 = Buffer.from(privKey, 'hex');
                        const tx = new EthTx(txParams)
                        tx.sign(privateKey1)
                        const serializedTx = tx.serialize()
                        return '0x' + serializedTx.toString('hex');
                    }

                    function sendRawTx(from, rawTx) {
                        return web3.eth.sendRawTransaction(rawTx);
                    }
                    var hash = callMyFunc();
                    console.log(hash);
                    var transactionData = {};
                    var uniqueId = Math.random().toString(36).substr(2, 16) + Math.random().toString(36).substr(2, 16);
                    var uniqueIdtemp = Math.random().toString(36).substr(2, 26);
                    transactionData.createdAt = new Date().toISOString();
                    transactionData.updatedAt = new Date().toISOString();
                    transactionData.transactionId = uniqueId;
                    transactionData.bitgoTransactionId = hash;
                    transactionData.userId = data.userId;
                    if (data.refTransactionId) {
                        transactionData.refTransactionId = data.refTransactionId;
                    } else {
                        transactionData.refTransactionId = uniqueId;
                    }
                    transactionData.dealType = "";
                    transactionData.buyFrom = "";
                    transactionData.currencyType = "";
                    transactionData.stopLossRate = "";
                    transactionData.stopProfitRate = "";
                    transactionData.limitStatus = "";
                    transactionData.limitRate = "";
                    transactionData.limitlevel = "";
                    transactionData.amount = data.amount;
                    transactionData.receiverUserId = "";
                    transactionData.finalAmount = data.amount;
                    transactionData.recipientAddress = data.recieverAddress;
                    transactionData.senderAddress = "";
                    transactionData.type = data.type;
                    transactionData.quantity = data.amount,
                        transactionData.recipientEmail = data.emailId;
                    transactionData.paymentProviderId = "NA";
                    transactionData.fees = data.fees;
                    transactionData.currentRate = "";
                    transactionData.transactionStatus = "CLOSED";
                    transactionData.symbol = data.symbol;
                    transactionData.margin = "";
                    transactionData.limit_level = "";
                    transactionData.stop_loss = "";
                    transactionData.stop_loss_amt = "";
                    transactionData.stop_loss_rate = "";
                    transactionData.stop_loss_percentage = "";
                    transactionData.stop_profit = "";
                    transactionData.stop_profit_amt = "";
                    transactionData.stop_profit_rate = "";
                    transactionData.stop_profit_percentage = "";
                    if (updatedData == null) {
                        transactionData.name = data.symbol;
                        transactionData.buySellRate = "NA";
                        transactionData.img = "NA";
                    } else {
                        transactionData.name = updatedData.name;
                        transactionData.buySellRate = updatedData.buyingPriceUsd;
                        transactionData.img = updatedData.img;
                    }
                    transactionData.profitOrLoss = "";
                    transactionData.contractTime = "";
                    transactionData.contractEndTime = "";
                    transactionData.bitgoTransaction = "";
                    transactionData.bitgoTransactionStatus = "";
                    transactionData.buyFromQuantity = "";
                    transactionData.link = "https://rinkeby.etherscan.io/tx/" + hash;
                    Service.transactionServices.saveTransactionDetail(transactionData, (err, savedData) => {
                        if (err) {
                            return callback(err);
                        } else {
                            return callback(null, savedData)
                        }
                    })
                }

            }
        })
    }
    const fetchAllTransactions = (callback) => {
        Service.transactionServices.fetchTransaction({}, {}, {}, (err, newData) => {
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
        fetchTransaction: fetchTransaction,
        addMoney: addMoney,
        createTransaction: createTransaction,
        updateTransaction: updateTransaction,
        updateTransactionCron: updateTransactionCron,
        erc20Transaction: erc20Transaction,
        fetchPairTransaction: fetchPairTransaction,
        fetchBuySellTransaction: fetchBuySellTransaction,
        fetchOrders: fetchOrders,
        fetchAllTransactions: fetchAllTransactions,
        fetchTransactionFromEmail: fetchTransactionFromEmail,
        fetchAllOrders:fetchAllOrders,
    }