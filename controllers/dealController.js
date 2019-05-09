var Service = require('../services');
const Config = require('../config');
var path = "http://" + Config.ServerPath;
var request = require('request');
var Controller = require('./transactionController');
var coinController = require('./coinMarketController');
var walletController = require('./walletController');
var BitGoJS = require('bitgo');
var bitgo = new BitGoJS.BitGo({
    env: 'test',
    accessToken: process.env.ACCESS_TOKEN,
});
var coinMarketData;
var type, imageDetail;
var UpdatedData;
var transactionData;
var Parse, walletId;
var receivedTransactions, receivedAdminData, receivedRates, recentlyUpdated;
const checkContract = function checkcontract(i) {
    const myFunction = function () {
        if (receivedTransactions[i].type == "BUY") {
            var currentTime = new Date().toISOString();
            console.log(currentTime, "++++++++++++++++++++++++++++++++++++++++++++++", receivedTransactions[i].contractEndTime)
            if (currentTime >= receivedTransactions[i].contractEndTime) {
                var currencyCriteria = {
                    symbol: receivedTransactions[i].symbol
                }
                Service.adminServices.fetchOne(currencyCriteria, {}, {}, function (err, adminData) {
                    if (err) {
                        return err.message;
                    } else {
                        receivedAdminData = adminData;
                        console.log(receivedAdminData, "adminData");
                        console.log(receivedTransactions[i].symbol, "adminData");
                        var rateCriteria = {
                            symbol: receivedTransactions[i].symbol
                        }
                        console.log(receivedTransactions[i].symbol, "adminData");
                        Service.cryptoServices.fetchOneCryptoData(rateCriteria, {}, {}, function (err, ratesData) {
                            if (err) {
                                return err.message;
                            } else {
                                receivedRates = ratesData;
                                console.log(ratesData, "ratesData");
                                var contractSell = receivedRates.sellingPriceUsd;
                                contractSell += (receivedRates.sellingPriceUsd * receivedAdminData.contractSellRate / 100)
                                var ProfitORLoss = receivedTransactions.buySellRate - contractSell;
                                if (ProfitORLoss < 0) {
                                    var balanceDeducted = (receivedTransactions[i].buyFromQuantity + ProfitORLoss)
                                    var receiveWalletCriteria = {
                                        type: "SENDERCONTRACT",
                                        userId: receivedTransactions[i].userId,
                                        symbol: receivedTransactions[i].symbol,
                                        balance: receivedTransactions[i].buyFromQuantity,
                                    };
                                    var senderWalletCriteria = {
                                        type: "SENDERCONTRACTEND",
                                        userId: receivedTransactions[i].userId,
                                        symbol: receivedTransactions[i].buyFrom,
                                        balance: balanceDeducted,
                                    };
                                } else {
                                    var receiveWalletCriteria = {
                                        type: "SENDERCONTRACT",
                                        userId: receivedTransactions[i].userId,
                                        symbol: receivedTransactions[i].symbol,
                                        balance: receivedTransactions[i].quantity,
                                    };
                                    var senderWalletCriteria = {
                                        type: "SENDERCONTRACTEND",
                                        userId: receivedTransactions[i].userId,
                                        symbol: receivedTransactions[i].buyFrom,
                                        balance: receivedTransactions[i].buyFromQuantity,
                                    };
                                }
                                var transactionCriteria = {
                                    transactionId: receivedTransactions[i].transactionId,
                                    amount: receivedTransactions[i].quantity,
                                    receiverUserId: receivedTransactions[i].userId,
                                    recipientAddress: "",
                                    senderAddress: "",
                                    limitRate: "0",
                                    updatedAt: new Date().toISOString(),
                                    bitgoTransactionId: "INTERNAL TRANSFER",
                                    bitgoTransaction: "INTERNAL TRANSFER",
                                    bitgoTransactionStatus: "INTERNAL TRANSFER",
                                    finalAmount: receivedTransactions[i].quantity,
                                    transactionStatus: "CLOSED",
                                    buyFromQuantity: receivedTransactions[i].buyFromQuantity,
                                };
                                walletController.updateWalletInternalTransfer(receiveWalletCriteria, function (err, updatedData) {
                                    if (err) {
                                        return err.message;
                                    } else {
                                        console.log(updatedData, "RECEIVER WALLET UPDATED");
                                        walletController.updateWalletInternalTransfer(senderWalletCriteria, function (err, UpdatedData) {
                                            if (err) {
                                                return err.message;
                                            } else {
                                                console.log(UpdatedData, "SENDER WALLET UPDATED");
                                                Controller.updateTransaction(transactionCriteria, function (err, NewData) {
                                                    if (err) {
                                                        return err.message;
                                                    } else {
                                                        console.log(NewData, "TRANSACTION UPDATED");
                                                        recentlyUpdated = NewData;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }

                        });
                    }
                });

            } else {
                console.log("NOT FOUND ")
            }
            return recentlyUpdated;
        } else if (receivedTransactions[i].type == "SELL") {
            var currentTime = new Date().toISOString();
            console.log(currentTime, "++++++++++++++++++++++++++++++++++++++++++++++", receivedTransactions[i].contractEndTime)
            if (currentTime >= receivedTransactions[i].contractEndTime) {
                var currencyCriteria = {
                    symbol: receivedTransactions[i].symbol
                };
                Service.adminServices.fetchOne(currencyCriteria, {}, {}, function (err, adminData) {
                    if (err) {
                        return err.message;
                    } else {
                        receivedAdminData = adminData;
                        console.log(receivedAdminData, "adminData");
                        console.log(receivedTransactions[i].symbol, "adminData");
                        var rateCriteria = {
                            symbol: receivedTransactions[i].symbol
                        }
                        console.log(receivedTransactions[i].symbol, "adminData");
                        Service.cryptoServices.fetchOneCryptoData(rateCriteria, {}, {}, function (err, ratesData) {
                            if (err) {
                                return err.message;
                            } else {
                                receivedRates = ratesData;
                                console.log(ratesData, "ratesData");
                                var contractSell = receivedRates.sellingPriceUsd;
                                contractSell += (receivedRates.sellingPriceUsd * receivedAdminData.contractSellRate / 100)
                                var ProfitORLoss = receivedTransactions.buySellRate - contractSell;
                                if (ProfitORLoss < 0) {
                                    var balanceDeducted = (receivedTransactions[i].buyFromQuantity + ProfitORLoss)
                                    var receiveWalletCriteria = {
                                        type: "SENDERCONTRACT",
                                        userId: receivedTransactions[i].userId,
                                        symbol: receivedTransactions[i].symbol,
                                        balance: receivedTransactions[i].buyFromQuantity,
                                    };
                                    var senderWalletCriteria = {
                                        type: "SENDERCONTRACTEND",
                                        userId: receivedTransactions[i].userId,
                                        symbol: receivedTransactions[i].buyFrom,
                                        balance: balanceDeducted,
                                    };
                                } else {
                                    var receiveWalletCriteria = {
                                        type: "SENDERCONTRACT",
                                        userId: receivedTransactions[i].userId,
                                        symbol: receivedTransactions[i].symbol,
                                        balance: receivedTransactions[i].quantity,
                                    };
                                    var senderWalletCriteria = {
                                        type: "SENDERCONTRACTEND",
                                        userId: receivedTransactions[i].userId,
                                        symbol: receivedTransactions[i].buyFrom,
                                        balance: receivedTransactions[i].buyFromQuantity,
                                    };
                                }
                                var transactionCriteria = {
                                    transactionId: receivedTransactions[i].transactionId,
                                    amount: receivedTransactions[i].quantity,
                                    receiverUserId: receivedTransactions[i].userId,
                                    recipientAddress: "",
                                    senderAddress: "",
                                    limitRate: "0",
                                    updatedAt: new Date().toISOString(),
                                    bitgoTransactionId: "INTERNAL TRANSFER",
                                    bitgoTransaction: "INTERNAL TRANSFER",
                                    bitgoTransactionStatus: "INTERNAL TRANSFER",
                                    finalAmount: receivedTransactions[i].quantity,
                                    transactionStatus: "CLOSED",
                                    buyFromQuantity: receivedTransactions[i].buyFromQuantity,
                                };
                                walletController.updateWalletInternalTransfer(receiveWalletCriteria, function (err, updatedData) {
                                    if (err) {
                                        return err.message;
                                    } else {
                                        console.log(updatedData, "RECEIVER WALLET UPDATED");
                                        walletController.updateWalletInternalTransfer(senderWalletCriteria, function (err, UpdatedData) {
                                            if (err) {
                                                return err.message;
                                            } else {
                                                console.log(UpdatedData, "SENDER WALLET UPDATED");
                                                Controller.updateTransaction(transactionCriteria, function (err, NewData) {
                                                    if (err) {
                                                        return err.message;
                                                    } else {
                                                        console.log(NewData, "TRANSACTION UPDATED");
                                                        recentlyUpdated = NewData;
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }

                        })
                    }
                })

            } else {
                console.log("NOT FOUND ")
            }
            return recentlyUpdated;
        }

    }
    return myFunction;
}
const checkDeal = function checkdeal(j) {
    const myfunction = (i) => {
        if (transactionData[j].type == "BUY") {
            if (UpdatedData[i].symbol == transactionData[j].symbol) {
                console.log(UpdatedData[i].symbol, transactionData[j].symbol, i, j, "=============================");
                if (transactionData[j].transactionStatus == "PENDING") {
                    //console.log("ININUpdatedData[i]UpdatedData[i]UpdatedData[i]UpdatedData[i]UpdatedData[i]",UpdatedData[i]);
                    if (UpdatedData[i].buyingPriceUsd <= transactionData[j].limitRate) {
                        var criteria = {
                            userId: transactionData[j].userId
                        };
                        var projection = {
                            wallet: {
                                $elemMatch: {
                                    symbol: transactionData[j].buyFrom
                                }
                            },
                        }
                        //console.log(transactionData[j].buyFrom, j, "INSIDE BUYFROM====================");
                        Service.walletServices.fetchWalletDetails(criteria, projection, (err, walletDetails) => {
                            if (err) {
                                return err.message;
                            } else {
                                // console.log(j, "BUYFROM====================");
                                var BuyFrom = transactionData[j].buyFrom;
                                var requiredBalance;
                                switch (BuyFrom) {
                                    case "BTC":
                                        var requiredBalance = transactionData[j].quantity * UpdatedData[i].buyingPriceBtc;
                                        break;
                                    case "ETH":
                                        var requiredBalance = transactionData[j].quantity * UpdatedData[i].buyingPriceEth;
                                        break;
                                    case "USDT":
                                        var requiredBalance = transactionData[j].quantity * UpdatedData[i].buyingPriceUsd;
                                        break;
                                        // case "CCD":
                                        //     var requiredBalance = Data[j].quantity * updatedData[i].price_btc
                                        //     break;
                                }
                                // console.log(requiredBalance, "==========================================================================================")
                                // console.log(walletDetails[0].wallet[0].balance, "][][][][][][][][][][][][][][][][][][][][]")
                                if (walletDetails[0].wallet[0].balance >= requiredBalance) {

                                    if (transactionData[j].stopLossRate == "0" && transactionData[j].stopProfitRate == "0") {
                                        var remainingBalance = walletDetails[0].wallet[0].balance - requiredBalance;
                                        var transactionCriteria = {
                                            transactionId: transactionData[j].transactionId,
                                            amount: transactionData[j].quantity,
                                            receiverUserId: transactionData[j].userId,
                                            recipientAddress: walletDetails[0].wallet[0].publicAddress,
                                            senderAddress: "",
                                            limitRate: transactionData[j].limitRate,
                                            updatedAt: new Date().toISOString(),
                                            bitgoTransactionId: "INTERNAL TRANSFER",
                                            bitgoTransaction: "INTERNAL TRANSFER",
                                            bitgoTransactionStatus: "INTERNAL TRANSFER",
                                            finalAmount: transactionData[j].quantity,
                                            transactionStatus: "CLOSED",
                                            buyFromQuantity: requiredBalance,
                                        };
                                        var receiveWalletCriteria = {
                                            type: "RECEIVER",
                                            userId: transactionData[j].userId,
                                            symbol: transactionData[j].symbol,
                                            balance: transactionData[j].quantity,
                                            sETHBalance: 0,
                                            sBTCBalance: 0,
                                            sUSDBalance: 0,
                                            sINRBalance: 0,
                                            fees: "1",
                                        };
                                        var senderWalletCriteria = {
                                            type: "SENDER",
                                            userId: transactionData[j].userId,
                                            symbol: transactionData[j].buyFrom,
                                            balance: remainingBalance,
                                        };
                                    } else {
                                        var remainingBalance = walletDetails[0].wallet[0].balance - requiredBalance;
                                        var transactionCriteria = {
                                            transactionId: transactionData[j].transactionId,
                                            amount: transactionData[j].quantity,
                                            receiverUserId: transactionData[j].userId,
                                            recipientAddress: walletDetails[0].wallet[0].publicAddress,
                                            senderAddress: "",
                                            limitRate: transactionData[j].limitRate,
                                            updatedAt: new Date().toISOString(),
                                            bitgoTransactionId: "INTERNAL TRANSFER",
                                            bitgoTransaction: "INTERNAL TRANSFER",
                                            bitgoTransactionStatus: "INTERNAL TRANSFER",
                                            finalAmount: transactionData[j].quantity,
                                            transactionStatus: "ACTIVE",
                                            buyFromQuantity: requiredBalance,
                                        };
                                        var receiveWalletCriteria = {
                                            type: "RECEIVER",
                                            userId: transactionData[j].userId,
                                            symbol: transactionData[j].symbol,
                                            balance: transactionData[j].quantity,
                                            sETHBalance: 0,
                                            sBTCBalance: 0,
                                            sUSDBalance: 0,
                                            sINRBalance: 0,
                                            fees: "1",
                                        };
                                        var senderWalletCriteria = {
                                            type: "SENDER",
                                            userId: transactionData[j].userId,
                                            symbol: transactionData[j].buyFrom,
                                            balance: remainingBalance,
                                        };
                                    }
                                    // console.log("INSIDE", j);

                                    Controller.updateTransaction(transactionCriteria, (err, NewData) => {
                                        if (err) {
                                            return err.message;
                                        } else {
                                            //console.log(NewData, "TRANSACTION UPDATED SUCCESSFULLY");
                                            walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
                                                if (err) {
                                                    return err.message;
                                                } else {
                                                    // console.log(updatedData, "RECEIVER WALLET UPDATED");
                                                    walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
                                                        if (err) {
                                                            return err.message;
                                                        } else {
                                                            // console.log(UpdatedData, "SENDER WALLET UPDATED");
                                                            if (updatedData) {
                                                                // console.log("UpdatedONE")
                                                            }
                                                        }
                                                    })
                                                }

                                            })

                                        }
                                    })
                                } else {
                                    var transactionCriteria = {
                                        transactionId: transactionData[j].transactionId,
                                        amount: transactionData[j].quantity,
                                        receiverUserId: transactionData[j].userId,
                                        recipientAddress: walletDetails[0].wallet[0].publicAddress,
                                        senderAddress: "",
                                        limitRate: "0",
                                        updatedAt: new Date().toISOString(),
                                        bitgoTransactionId: "INSUFFICIENT FUNDS",
                                        bitgoTransaction: "INSUFFICIENT FUNDS",
                                        bitgoTransactionStatus: "INSUFFICIENT FUNDS",
                                        finalAmount: transactionData[j].quantity,
                                        transactionStatus: "CLOSED",
                                        buyFromQuantity: requiredBalance,
                                    };
                                    Controller.updateTransaction(transactionCriteria, (err, NewData) => {
                                        if (err) {
                                            return err.message;
                                        } else {
                                            console.log(NewData, "TRANSACTION UPDATED SUCCESSFULLY");
                                            console.log("INSUFFICIENT FUNDS");
                                        }
                                    })
                                    return NewData;
                                }

                            }
                        })
                    }

                } else {
                    console.log("SYMBOL MATCH NAI HUE");
                }

            }
        } else if (transactionData[j].type == "SELL") {
            if (UpdatedData[i].symbol == transactionData[j].buyFrom) {
                console.log(UpdatedData[i].symbol, transactionData[j].buyFrom, i, j, "=============================");
                if (transactionData[j].transactionStatus == "PENDING") {
                    console.log("ININ", j);
                    if (UpdatedData[i].sellrate_USD >= transactionData[j].limitRate) {
                        var criteria = {
                            userId: transactionData[j].userId
                        };
                        var projection = {
                            wallet: {
                                $elemMatch: {
                                    symbol: transactionData[j].buyFrom
                                }
                            },
                        }
                        console.log(transactionData[j].buyFrom, j, "INSIDE BUYFROM====================");
                        Service.walletServices.fetchWalletDetails(criteria, projection, (err, walletDetails) => {
                            if (err) {
                                return err.message;
                            } else {
                                console.log(j, "BUYFROM====================");
                                var Buy = transactionData[j].symbol;
                                switch (Buy) {
                                    case "BTC":
                                        var requiredBalance = transactionData[j].quantity * UpdatedData[i].price_btc
                                        break;
                                    case "ETH":
                                        var requiredBalance = transactionData[j].quantity * UpdatedData[i].price_eth
                                        break;
                                    case "USDT":
                                        var requiredBalance = transactionData[j].quantity * UpdatedData[i].price_usd
                                        break;
                                        // case "CCD":
                                        //     var requiredBalance = Data[j].quantity * updatedData[i].price_btc
                                        //     break;
                                }
                                if (walletDetails[0].wallet[0].balance >= requiredBalance) {
                                    console.log("INSIDE", j)
                                    var remainingBalance = walletDetails[0].wallet[0].balance - requiredBalance;
                                    var transactionCriteria = {
                                        transactionId: transactionData[j].transactionId,
                                        amount: transactionData[j].quantity,
                                        receiverUserId: transactionData[j].userId,
                                        recipientAddress: walletDetails[0].wallet[0].publicAddress,
                                        senderAddress: "",
                                        limitRate: "0",
                                        updatedAt: new Date().toISOString(),
                                        bitgoTransactionId: "INTERNAL TRANSFER",
                                        bitgoTransaction: "INTERNAL TRANSFER",
                                        bitgoTransactionStatus: "INTERNAL TRANSFER",
                                        finalAmount: transactionData[j].quantity,
                                        transactionStatus: "ACTIVE",
                                        buyFromQuantity: requicheckingredBalance,
                                    };
                                    var receiveWalletCriteria = {
                                        type: "RECEIVER",
                                        userId: transactionData[j].userId,
                                        symbol: transactionData[j].symbol,
                                        balance: transactionData[j].quantity,
                                        sETHBalance: 0,
                                        sBTCBalance: 0,
                                        sUSDBalance: 0,
                                        sINRBalance: 0,
                                        fees: "1",
                                    };
                                    var senderWalletCriteria = {
                                        type: "SENDER",
                                        userId: transactionData[j].userId,
                                        symbol: transactionData[j].buyFrom,
                                        balance: remainingBalance,
                                    };
                                    Controller.updateTransaction(transactionCriteria, (err, NewData) => {
                                        if (err) {
                                            return err.message;
                                        } else {
                                            console.log(NewData, "TRANSACTION UPDATED SUCCESSFULLY");
                                            walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
                                                if (err) {
                                                    return err.message;
                                                } else {
                                                    console.log(updatedData, "RECEIVER WALLET UPDATED");
                                                    walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
                                                        if (err) {
                                                            return err.message;
                                                        } else {
                                                            console.log(UpdatedData, "SENDER WALLET UPDATED");
                                                            if (UpdatedData) {
                                                                console.log("UpdatedONE")
                                                            }
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    var transactionCriteria = {
                                        transactionId: transactionData[j].transactionId,
                                        amount: transactionData[j].quantity,
                                        receiverUserId: transactionData[j].userId,
                                        recipientAddress: walletDetails[0].wallet[0].publicAddress,
                                        senderAddress: "",
                                        limitRate: "0",
                                        updatedAt: new Date().toISOString(),
                                        bitgoTransactionId: "INSUFFICIENT FUNDS",
                                        bitgoTransaction: "INSUFFICIENT FUNDS",
                                        bitgoTransactionStatus: "INSUFFICIENT FUNDS",
                                        finalAmount: transactionData[j].quantity,
                                        transactionStatus: "CLOSED",
                                        buyFromQuantity: requiredBalance,
                                    };
                                    Controller.updateTransaction(transactionCriteria, (err, NewData) => {
                                        if (err) {
                                            return err.message;
                                        } else {
                                            console.log(NewData, "TRANSACTION UPDATED SUCCESSFULLY");
                                            console.log("INSUFFICIENT FUNDS");
                                        }
                                    })
                                    return NewData;
                                }
                            }
                        })
                    }
                }
            } else {
                console.log("NOT FOUND", i, j);
            }
        }

        return UpdatedData;
    }
    return myfunction;
}
const saveDeal = (data, callback) => {
    if (data.transactionType == "BUY") {
        var uniqueId = Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16);
        var criteria = {
            symbol: data.exchangeCurrencyFrom
        };
        data.type = data.type.toUpperCase();
        Service.cryptoServices.fetchOneCryptoData(criteria, {}, {}, (err, details) => {
            if (err) {
                return err.message;
            } else {
                imageDetail = details
                console.log("imageDetail===================================================================", imageDetail.img);

                if (data.type == "CONTRACT") {
                    console.log(data.contractTime, "TIME");
                    switch (data.contractTime) {
                        case "24Hours":
                            var endTime = new Date()
                            endTime.setDate(endTime.getDate() + 1)
                            endTime = endTime.toISOString();
                            break;
                        case "7Days":
                            var endTime = new Date()
                            endTime.setDate(endTime.getDate() + 7)
                            endTime = endTime.toISOString();
                            break;
                        case "15Days":
                            var endTime = new Date()
                            endTime.setDate(endTime.getDate() + 15)
                            endTime = endTime.toISOString();
                            break;
                        case "21Days":
                            var endTime = new Date()
                            endTime.setDate(endTime.getDate() + 21)
                            endTime = endTime.toISOString();
                            break;
                        case "30Days":
                            var endTime = new Date()
                            endTime.setDate(endTime.getDate() + 30)
                            endTime = endTime.toISOString();
                            break;
                        case "45Days":
                            var endTime = new Date()
                            endTime.setDate(endTime.getDate() + 45)
                            endTime = endTime.toISOString();
                            break;
                        case "60Days":
                            var endTime = new Date()
                            endTime.setDate(endTime.getDate() + 60)
                            endTime = endTime.toISOString();
                            break;
                        case "90Days":
                            var endTime = new Date()
                            endTime.setDate(endTime.getDate() + 90)
                            endTime = endTime.toISOString();
                            break;
                    }
                    var criteria = {
                        userId: data.userId,
                        type: data.transactionType,
                        dealType: data.type,
                        buySellRate: data.buySellRate,
                        quantity: data.quantity,
                        fees: data.fees,
                        buyFrom: data.exchangeCurrencyFrom,
                        symbol: data.exchangeCurrencyTo,
                        currencyType: "CRYPTO",
                        stopLossRate: data.stopLoss,
                        stopProfitRate: data.stopProfit,
                        limitStatus: "CONTRACT",
                        limitRate: "",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        transactionId: uniqueId,
                        amount: data.quantity,
                        receiverUserId: data.userId,
                        recipientAddress: "",
                        senderAddress: "",
                        bitgoTransactionId: "",
                        bitgoTransaction: "",
                        bitgoTransactionStatus: "",
                        limitlevel: "",
                        finalAmount: "",
                        currentRate: "",
                        recipientEmail: "",
                        paymentProviderId: "",
                        transactionStatus: "PENDING",
                        margin: data.margin,
                        contractTime: data.contractTime,
                        contractEndTime: endTime,
                        name: data.exchangeCurrencyTo,
                        profitOrLoss: "",
                        img: imageDetail.img,
                        buyFromQuantity: data.requiredAmount,
                        deal: "",
                    };
                    var walletCriteria = {
                        userId: data.userId
                    }
                    var walletProjection = {
                        wallet: {
                            $elemMatch: {
                                symbol: data.exchangeCurrencyFrom
                            }
                        }
                    }
                    console.log(criteria, "C   R   I   T   E   R   I   A")
                    Service.walletServices.fetchWalletDetails(walletCriteria, walletProjection, (err, walletData) => {
                        if (err) {
                            return callback(err.message)
                        } else {
                            console.log(walletData[0].wallet[0].balance, "walletData");
                            if (data.requiredAmount <= walletData[0].wallet[0].balance) {
                                Controller.createTransaction(criteria, (err, newData) => {
                                    console.log(err, newData);
                                    if (err) {
                                        if (err.code && err.code == 11000) {
                                            return callback(err.message);
                                        }
                                        return callback(err);
                                    } else {
                                        console.log("INSIDE+_+_+______");
                                        var receiveWalletCriteria = {
                                            type: "RECEIVER",
                                            userId: data.userId,
                                            symbol: data.exchangeCurrencyTo,
                                            balance: data.quantity,
                                            sETHBalance: 0,
                                            sBTCBalance: 0,
                                            sUSDBalance: 0,
                                            sINRBalance: 0,
                                            fees: data.fees,
                                        };
                                        var senderWalletCriteria = {
                                            type: "SENDERCONTRACT",
                                            userId: data.userId,
                                            symbol: data.exchangeCurrencyFrom,
                                            balance: parseInt(data.requiredAmount),
                                        };
                                        walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
                                            if (err) {
                                                return err.message;
                                            } else {
                                                console.log(updatedData, "RECEIVER WALLET UPDATED");
                                                walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
                                                    if (err) {
                                                        return err.message;
                                                    } else {
                                                        console.log(UpdatedData, "SENDER WALLET UPDATED");
                                                    }
                                                })
                                            }
                                        })
                                        return callback(null, newData);
                                    }
                                })
                            } else {
                                return callback({
                                    "MESSAGE": "INSUFFICIENT BALANCE IN " + data.exchangeCurrencyFrom + " WALLET"
                                })
                            }
                        }
                    })
                } else if (data.type == "LIMIT") {
                    var walletCriteria = {
                        userId: data.userId
                    }
                    var walletProjection = {
                        wallet: {
                            $elemMatch: {
                                symbol: data.exchangeCurrencyFrom
                            }
                        }
                    }
                    var criteria = {
                        userId: data.userId,
                        type: data.transactionType,
                        dealType: data.type,
                        buySellRate: data.buySellRate,
                        quantity: data.quantity,
                        fees: data.fees,
                        buyFrom: data.exchangeCurrencyFrom,
                        symbol: data.exchangeCurrencyTo,
                        currencyType: "CRYPTO",
                        stopLossRate: data.stopLoss,
                        stopProfitRate: data.stopProfit,
                        limitStatus: "LIMIT",
                        limitRate: data.limitRate,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        transactionId: uniqueId,
                        amount: data.quantity,
                        receiverUserId: data.userId,
                        recipientAddress: "",
                        senderAddress: "",
                        currentRate: "",
                        bitgoTransactionId: "",
                        bitgoTransaction: "",
                        bitgoTransactionStatus: "",
                        limitlevel: "",
                        finalAmount: "",
                        recipientEmail: "",
                        paymentProviderId: "",
                        transactionStatus: "PENDING",
                        margin: "",
                        contractEndTime: "",
                        name: data.exchangeCurrencyTo,
                        profitOrLoss: "",
                        img: imageDetail.img,
                        contractTime: "",
                        buyFromQuantity: data.requiredAmount,
                        deal: "",
                    };
                    Service.walletServices.fetchWalletDetails(walletCriteria, walletProjection, (err, walletData) => {
                        if (err) {
                            return callback(err.message)
                        } else {
                            console.log(walletData[0].wallet[0].balance, "walletData");
                            if (data.requiredAmount <= walletData[0].wallet[0].balance) {
                                Controller.createTransaction(criteria, (err, newData) => {
                                    console.log(err, newData);
                                    if (err) {
                                        if (err.code && err.code == 11000) {
                                            return callback(err.message);
                                        }
                                        return callback(err);
                                    } else {
                                        var receiveWalletCriteria = {
                                            type: "RECEIVER",
                                            userId: data.userId,
                                            symbol: data.exchangeCurrencyTo,
                                            balance: data.quantity,
                                            sETHBalance: 0,
                                            sBTCBalance: 0,
                                            sUSDBalance: 0,
                                            sINRBalance: 0,
                                            fees: data.fees,
                                        };
                                        var senderWalletCriteria = {
                                            type: "SENDERCONTRACT",
                                            userId: data.userId,
                                            symbol: data.exchangeCurrencyFrom,
                                            balance: data.requiredAmount,
                                        };
                                        walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
                                            if (err) {
                                                return err.message;
                                            } else {
                                                console.log(updatedData, "RECEIVER WALLET UPDATED");
                                                walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
                                                    if (err) {
                                                        return err.message;
                                                    } else {
                                                        console.log(UpdatedData, "SENDER WALLET UPDATED");
                                                    }
                                                })
                                            }

                                        })
                                        return callback(null, newData);
                                    }
                                })
                            } else {
                                return callback({
                                    "MESSAGE": "INSUFFICIENT BALANCE IN " + data.exchangeCurrencyFrom + " WALLET"
                                })
                            }
                        }
                    })

                }
            }
        })
    } else if (data.transactionType == "SELL") {
        var uniqueId = Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16);
        var criteria = {
            symbol: data.exchangeCurrencyFrom
        };
        data.type = data.type.toUpperCase();
        Service.cryptoServices.fetchOneCryptoData(criteria, {}, {}, (err, details) => {
            if (err) {
                return err.message;
            } else {
                imageDetail = details;
                console.log("imageDetail++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=", imageDetail.img);
                if (data.type == "CONTRACT") {
                    switch (data.contractTime) {
                        case "24Hours":
                            var endTime = new Date()
                            endTime.setDate(endTime.getDate() + 1)
                            endTime = endTime.toISOString();
                            break;
                        case "7Days":
                            var endTime = new Date()
                            endTime.setDate(endTime.getDate() + 7)
                            endTime = endTime.toISOString();
                            break;
                        case "15Days":
                            var endTime = new Date()
                            endTime.setDate(endTime.getDate() + 15)
                            endTime = endTime.toISOString();
                            break;
                        case "21Days":
                            var endTime = new Date()
                            endTime.setDate(endTime.getDate() + 21)
                            endTime = endTime.toISOString();
                            break;
                        case "30Days":
                            var endTime = new Date()
                            endTime.setDate(endTime.getDate() + 30)
                            endTime = endTime.toISOString();
                            break;
                    }
                    var criteria = {
                        userId: data.userId,
                        type: data.transactionType,
                        dealType: data.type,
                        buySellRate: data.buySellRate,
                        quantity: data.quantity,
                        fees: data.fees,
                        buyFrom: data.exchangeCurrencyFrom,
                        symbol: data.exchangeCurrencyTo,
                        currencyType: "CRYPTO",
                        stopLossRate: data.stopLoss,
                        stopProfitRate: data.stopProfit,
                        limitStatus: "CONTRACT",
                        limitRate: "",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        transactionId: uniqueId,
                        amount: data.quantity,
                        receiverUserId: data.userId,
                        recipientAddress: "",
                        senderAddress: "",
                        bitgoTransactionId: "",
                        bitgoTransaction: "",
                        bitgoTransactionStatus: "",
                        limitlevel: "",
                        finalAmount: "",
                        currentRate: "",
                        recipientEmail: data.emailId,
                        paymentProviderId: "",
                        transactionStatus: "PENDING",
                        margin: data.margin,
                        contractTime: data.contractTime,
                        contractEndTime: endTime,
                        name: data.exchangeCurrencyTo,
                        profitOrLoss: "",
                        img: imageDetail.img,
                        buyFromQuantity: data.requiredAmount,
                        deal: "",
                    };
                    var walletCriteria = {
                        userId: data.userId
                    }
                    var walletProjection = {
                        wallet: {
                            $elemMatch: {
                                symbol: data.exchangeCurrencyFrom
                            }
                        }
                    }
                    Service.walletServices.fetchWalletDetails(walletCriteria, walletProjection, (err, walletData) => {
                        if (err) {
                            return callback(err.message)
                        } else {
                            console.log(walletData[0].wallet[0].balance, "walletData");
                            if (data.requiredAmount <= walletData[0].wallet[0].balance) {
                                Controller.createTransaction(criteria, (err, newData) => {
                                    console.log(err, newData);
                                    if (err) {
                                        if (err.code && err.code == 11000) {
                                            return callback(err.message);
                                        }
                                        return callback(err);
                                    } else {
                                        console.log("INSIDE+_+_+______");
                                        var receiveWalletCriteria = {
                                            type: "RECEIVER",
                                            userId: data.userId,
                                            symbol: data.exchangeCurrencyTo,
                                            balance: data.quantity,
                                            sETHBalance: 0,
                                            sBTCBalance: 0,
                                            sUSDBalance: 0,
                                            sINRBalance: 0,
                                            fees: data.fees,
                                        };
                                        var senderWalletCriteria = {
                                            type: "SENDERCONTRACT",
                                            userId: data.userId,
                                            symbol: data.exchangeCurrencyFrom,
                                            balance: data.requiredAmount,
                                        };
                                        walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
                                            if (err) {
                                                return err.message;
                                            } else {
                                                console.log(updatedData, "RECEIVER WALLET UPDATED");
                                                walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
                                                    if (err) {
                                                        return err.message;
                                                    } else {
                                                        console.log(UpdatedData, "SENDER WALLET UPDATED");
                                                    }
                                                })
                                            }

                                        })
                                        return callback(null, newData);

                                    }


                                })
                            } else {
                                return callback({
                                    "MESSAGE": "INSUFFICIENT BALANCE IN " + data.exchangeCurrencyFrom + " WALLET"
                                })
                            }
                        }
                    })
                } else if (data.type == "LIMIT") {
                    var criteria = {
                        userId: data.userId,
                        type: data.transactionType,
                        dealType: data.type,
                        buySellRate: data.buySellRate,
                        quantity: data.quantity,
                        fees: data.fees,
                        buyFrom: data.exchangeCurrencyFrom,
                        symbol: data.exchangeCurrencyTo,
                        currencyType: "CRYPTO",
                        stopLossRate: data.stopLoss,
                        stopProfitRate: data.stopProfit,
                        limitStatus: "LIMIT",
                        limitRate: data.limitRate,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        transactionId: uniqueId,
                        amount: data.quantity,
                        receiverUserId: data.userId,
                        recipientAddress: "",
                        senderAddress: "",
                        currentRate: "",
                        bitgoTransactionId: "",
                        bitgoTransaction: "",
                        bitgoTransactionStatus: "",
                        limitlevel: "",
                        finalAmount: "",
                        recipientEmail: data.emailId,
                        paymentProviderId: "",
                        transactionStatus: "PENDING",
                        margin: "",
                        contractEndTime: "",
                        name: data.exchangeCurrencyTo,
                        profitOrLoss: "",
                        img: imageDetail.img,
                        contractTime: "",
                        buyFromQuantity: data.requiredAmount,
                        deal: "",
                    };
                    var walletCriteria = {
                        userId: data.userId
                    }
                    var walletProjection = {
                        wallet: {
                            $elemMatch: {
                                symbol: data.exchangeCurrencyFrom
                            }
                        }
                    }
                    Service.walletServices.fetchWalletDetails(walletCriteria, walletProjection, (err, walletData) => {
                        if (err) {
                            return callback(err.message)
                        } else {
                            console.log(walletData[0].wallet[0].balance, data.requiredAmount, "walletData");
                            if (data.requiredAmount <= walletData[0].wallet[0].balance) {
                                Controller.createTransaction(criteria, (err, newData) => {
                                    console.log(err, newData);
                                    if (err) {
                                        if (err.code && err.code == 11000) {
                                            return callback(err.message);
                                        }
                                        return callback(err);
                                    } else {
                                        var receiveWalletCriteria = {
                                            type: "RECEIVER",
                                            userId: data.userId,
                                            symbol: data.exchangeCurrencyTo,
                                            balance: data.quantity,
                                            sETHBalance: 0,
                                            sBTCBalance: 0,
                                            sUSDBalance: 0,
                                            sINRBalance: 0,
                                            fees: data.fees,
                                        };
                                        var senderWalletCriteria = {
                                            type: "SENDERCONTRACT",
                                            userId: data.userId,
                                            symbol: data.exchangeCurrencyFrom,
                                            balance: data.requiredAmount,
                                        };
                                        walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
                                            if (err) {
                                                return err.message;
                                            } else {
                                                console.log(updatedData, "RECEIVER WALLET UPDATED");
                                                walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
                                                    if (err) {
                                                        return err.message;
                                                    } else {
                                                        console.log(UpdatedData, "SENDER WALLET UPDATED");
                                                    }
                                                })
                                            }

                                        })
                                        return callback(null, newData);
                                    }
                                })
                            } else {
                                return callback({
                                    "MESSAGE": "INSUFFICIENT BALANCE IN " + data.exchangeCurrencyFrom + " WALLET"
                                })
                            }
                        }
                    })
                }
            }

        })
    }
}
const transactDeal = (callback) => {
    Service.cryptoServices.fetchUpdatedCryptoRates((err, updatedData) => {
        if (err) {
            if (err.code && err.code == 11000) {
                return (err.message);
            }
            return err;
        } else {
            UpdatedData = updatedData;
            //console.log(updatedData, updatedData.length, "+++++++++++++++++++++++++++++++++=")
            ////////////////////////***********************FETCH ALL PENDING DEALS **************************///////////////////////////////
            var criteria = {
                dealType: "LIMIT",
                transactionStatus: {
                    $ne: "CLOSED"
                },
                limitRate: {
                    $ne: "0"
                },
            }
            Service.transactionServices.fetchTransaction(criteria, {}, {}, (err, Data) => {
                if (err) {
                    return err.message;
                } else {
                    transactionData = Data;
                    // console.log(Data,`Data-=-==-=-=-=-=-=-=-=-=-==========-----------------============`);
                    //console.log(transactionData,`transactionData-=-==-=-=-=-=-=-=-=-=-==========-----------------============`);
                    if (transactionData.length > 0) {
                        for (let i = 0; i < UpdatedData.length; i++) {
                            //console.log("updatedData[i].symbol", UpdatedData.length, transactionData.length);
                            //console.log(i, "i");
                            for (let j = 0; j < transactionData.length; j++) {
                                //console.log("Data[j].exchangeCurrencyTo", Data[j].symbol)
                                //console.log(j, "j");
                                var inserting = checkDeal(j);
                                let tempry = inserting(i);
                                console.log(inserting, "**********&&ttttttttttttt&&&&&&&&&***********");
                            }
                            if (i == 99) {
                                console.log("OUT FROM LOOP");
                                return callback(null, {
                                    "MESSAGE": "LOOP COMPLETE"
                                });
                            }
                        }
                    } else {
                        return callback(null, {
                            "MESSAGE": "No Deals To Transact"
                        });

                    }
                }
            })
        }
    })
}
const transactContract = (callback) => {
    var criteria = {
        dealType: "CONTRACT",
        transactionStatus: {
            $ne: "CLOSED"
        },
    }
    Service.transactionServices.fetchTransaction(criteria, {}, {}, (err, dataReceived) => {
        if (err) {
            return err.message;
        } else {
            receivedTransactions = dataReceived;
            console.log("No of Transactions:", receivedTransactions.length, receivedTransactions);
            if (receivedTransactions.length > 0) {
                for (var i = 0; i < receivedTransactions.length; i++) {
                    var checking = checkContract(i);
                    var temp = checking();
                }
                return callback(null, dataReceived);

            } else {
                return callback(null, {
                    "MESSAGE": "No Contracts To Transact"
                });
            }
        }
    })
}
const checkStopLossOrProfit = function checkstoplossorprofit(j) {
    const myfunction = (i) => {
        console.log("HERE");
        if (receivedTransactions[j].stopLossRate != 0) {
            console.log("Satisfied 1");
            if (receivedTransactions[j].type == "BUY") {
                console.log("Satisfied 3");
                if (receivedTransactions[j].symbol == UpdatedData[i].symbol) {

                    if (receivedTransactions[j].stopLossRate >= UpdatedData[i].sellingPriceUsd) {
                        var criteria = {
                            symbol: receivedTransactions[j].buyFrom
                        };
                        Service.cryptoServices.fetchOneCryptoData(criteria, {}, {}, (err, details) => {
                            if (err) {
                                return err.message;
                            } else {
                                imageDetail = details
                                var updateCriteria = {
                                    case: "STOPLOSS",
                                    transactionStatus: "CLOSED",
                                    updatedAt: new Date().toISOString(),
                                    transactionId: receivedTransactions[j].transactionId,
                                };
                                var createCriteria = {
                                    userId: receivedTransactions[j].userId,
                                    type: "SELL",
                                    dealType: receivedTransactions[j].dealType,
                                    buySellRate: "",
                                    quantity: receivedTransactions[j].quantity,
                                    fees: receivedTransactions[j].fees,
                                    buyFrom: receivedTransactions[j].symbol,
                                    symbol: receivedTransactions[j].buyFrom,
                                    currencyType: "CRYPTO",
                                    stopLossRate: 0,
                                    stopProfitRate: 0,
                                    limitStatus: "LIMIT",
                                    limitRate: receivedTransactions[j].limitRate,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString(),
                                    transactionId: "",
                                    refTransactionId: receivedTransactions[j].transactionId,
                                    amount: receivedTransactions[j].quantity,
                                    receiverUserId: receivedTransactions[j].userId,
                                    recipientAddress: "",
                                    senderAddress: "",
                                    currentRate: "",
                                    bitgoTransactionId: "",
                                    bitgoTransaction: "",
                                    bitgoTransactionStatus: "",
                                    limitlevel: "",
                                    finalAmount: "",
                                    recipientEmail: "",
                                    paymentProviderId: "",
                                    transactionStatus: "CLOSED",
                                    margin: "",
                                    contractEndTime: "",
                                    name: receivedTransactions[j].exchangeCurrencyTo,
                                    profitOrLoss: "",
                                    img: imageDetail.img,
                                    contractTime: "",
                                    buyFromQuantity: "",
                                    deal: "",
                                };
                                var receiveWalletCriteria = {
                                    type: "SENDERSTOPLOSS",
                                    userId: receivedTransactions[j].userId,
                                    symbol: receivedTransactions[j].symbol,
                                    balance: receivedTransactions[j].quantity,
                                };
                                var senderWalletCriteria = {
                                    type: "RECEIVERSTOPLOSS",
                                    userId: receivedTransactions[j].userId,
                                    symbol: receivedTransactions[j].buyFrom,
                                    balance: receivedTransactions[j].quantity,
                                };


                                // if (-(receivedTransactions[i].profitOrLoss) >= receivedTransactions[i].stopLossRate) {
                                console.log("Satisfied 4");


                                walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
                                    if (err) {
                                        return err.message;
                                    } else {
                                        console.log(updatedData, "RECEIVER WALLET UPDATED");
                                        walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
                                            if (err) {
                                                return err.message;
                                            } else {
                                                console.log(UpdatedData, "SENDER WALLET UPDATED");
                                                Controller.updateTransaction(updateCriteria, (err, NewData) => {
                                                    if (err) {
                                                        return err.message;
                                                    } else {
                                                        console.log(NewData, "TRANSACTION UPDATED");
                                                        recentlyUpdated = NewData;
                                                        Controller.createTransaction(createCriteria, (err, NewData) => {
                                                            if (err) {
                                                                return err.message;
                                                            } else {
                                                                console.log(NewData, "TRANSACTION CREATED");
                                                                recentlyUpdated = NewData;
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                        return recentlyUpdated;
                    }
                } else {
                    console.log(`PRICE NOT YET MATCHED`);
                    return;
                }

            } else if (receivedTransactions[j].type == "SELL") {
                if (receivedTransactions[j].buyFrom == UpdatedData[i].symbol) {
                    if (receivedTransactions[j].stopLossRate <= UpdatedData[i].buyingPriceUsd) {
                        var criteria = {
                            symbol: receivedTransactions[j].symbol
                        };
                        Service.cryptoServices.fetchOneCryptoData(criteria, {}, {}, (err, details) => {
                            if (err) {
                                return err.message;
                            } else {
                                imageDetail = details
                                var updateCriteria = {
                                    case: "STOPLOSS",
                                    transactionStatus: "CLOSED",
                                    updatedAt: new Date().toISOString(),
                                    transactionId: receivedTransactions[j].transactionId,
                                };
                                var createCriteria = {
                                    userId: receivedTransactions[j].userId,
                                    type: "BUY",
                                    dealType: receivedTransactions[j].dealType,
                                    buySellRate: "",
                                    quantity: receivedTransactions[j].quantity,
                                    fees: receivedTransactions[j].fees,
                                    buyFrom: receivedTransactions[j].symbol,
                                    symbol: receivedTransactions[j].buyFrom,
                                    currencyType: "CRYPTO",
                                    stopLossRate: 0,
                                    stopProfitRate: 0,
                                    limitStatus: "LIMIT",
                                    limitRate: receivedTransactions[j].limitRate,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString(),
                                    transactionId: "",
                                    refTransactionId: receivedTransactions[j].transactionId,
                                    amount: receivedTransactions[j].quantity,
                                    receiverUserId: receivedTransactions[j].userId,
                                    recipientAddress: "",
                                    senderAddress: "",
                                    currentRate: "",
                                    bitgoTransactionId: "",
                                    bitgoTransaction: "",
                                    bitgoTransactionStatus: "",
                                    limitlevel: "",
                                    finalAmount: "",
                                    recipientEmail: "",
                                    paymentProviderId: "",
                                    transactionStatus: "CLOSED",
                                    margin: "",
                                    contractEndTime: "",
                                    name: receivedTransactions[j].exchangeCurrencyTo,
                                    profitOrLoss: "",
                                    img: imageDetail.img,
                                    contractTime: "",
                                    buyFromQuantity: "",
                                    deal: "",
                                };
                                var receiveWalletCriteria = {
                                    type: "SENDERSTOPLOSS",
                                    userId: receivedTransactions[j].userId,
                                    symbol: receivedTransactions[j].symbol,
                                    balance: receivedTransactions[j].quantity,
                                };
                                var senderWalletCriteria = {
                                    type: "RECEIVERSTOPLOSS",
                                    userId: receivedTransactions[j].userId,
                                    symbol: receivedTransactions[j].buyFrom,
                                    balance: receivedTransactions[j].quantity,
                                };
                                walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
                                    if (err) {
                                        return err.message;
                                    } else {
                                        console.log(updatedData, "RECEIVER WALLET UPDATED");
                                        walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
                                            if (err) {
                                                return err.message;
                                            } else {
                                                console.log(UpdatedData, "SENDER WALLET UPDATED");
                                                Controller.updateTransaction(updateCriteria, (err, NewData) => {
                                                    if (err) {
                                                        return err.message;
                                                    } else {
                                                        console.log(NewData, "TRANSACTION UPDATED");
                                                        Controller.createTransaction(createCriteria, (err, NewData) => {
                                                            if (err) {
                                                                return err.message;
                                                            } else {
                                                                console.log(NewData, "TRANSACTION CREATED");
                                                                recentlyUpdated = NewData;
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }

                        })
                        return recentlyUpdated;
                    } else {
                        console.log(`PRICE NOT MATCHED`);
                    }

                    return myfunction;
                }
            }
        }else if(receivedTransactions[j].stopProfitRate != 0){ 
            if (receivedTransactions[j].type == "BUY") {
            console.log("Satisfied 3");
            if (receivedTransactions[j].symbol == UpdatedData[i].symbol) {

                if (receivedTransactions[j].stopProfitRate <= UpdatedData[i].sellingPriceUsd) {
                    var criteria = {
                        symbol: receivedTransactions[j].buyFrom
                    };
                    Service.cryptoServices.fetchOneCryptoData(criteria, {}, {}, (err, details) => {
                        if (err) {
                            return err.message;
                        } else {
                            imageDetail = details
                            var updateCriteria = {
                                case: "STOPLOSS",
                                transactionStatus: "CLOSED",
                                updatedAt: new Date().toISOString(),
                                transactionId: receivedTransactions[j].transactionId,
                            };
                            var createCriteria = {
                                userId: receivedTransactions[j].userId,
                                type: "SELL",
                                dealType: receivedTransactions[j].dealType,
                                buySellRate: "",
                                quantity: receivedTransactions[j].quantity,
                                fees: receivedTransactions[j].fees,
                                buyFrom: receivedTransactions[j].symbol,
                                symbol: receivedTransactions[j].buyFrom,
                                currencyType: "CRYPTO",
                                stopLossRate: 0,
                                stopProfitRate: 0,
                                limitStatus: "LIMIT",
                                limitRate: receivedTransactions[j].limitRate,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                transactionId: "",
                                refTransactionId: receivedTransactions[j].transactionId,
                                amount: receivedTransactions[j].quantity,
                                receiverUserId: receivedTransactions[j].userId,
                                recipientAddress: "",
                                senderAddress: "",
                                currentRate: "",
                                bitgoTransactionId: "",
                                bitgoTransaction: "",
                                bitgoTransactionStatus: "",
                                limitlevel: "",
                                finalAmount: "",
                                recipientEmail: "",
                                paymentProviderId: "",
                                transactionStatus: "CLOSED",
                                margin: "",
                                contractEndTime: "",
                                name: receivedTransactions[j].exchangeCurrencyTo,
                                profitOrLoss: "",
                                img: imageDetail.img,
                                contractTime: "",
                                buyFromQuantity: "",
                                deal: "",
                            };
                            var receiveWalletCriteria = {
                                type: "SENDERSTOPLOSS",
                                userId: receivedTransactions[j].userId,
                                symbol: receivedTransactions[j].symbol,
                                balance: receivedTransactions[j].quantity,
                            };
                            var senderWalletCriteria = {
                                type: "RECEIVERSTOPLOSS",
                                userId: receivedTransactions[j].userId,
                                symbol: receivedTransactions[j].buyFrom,
                                balance: receivedTransactions[j].quantity,
                            };


                            // if (-(receivedTransactions[i].profitOrLoss) >= receivedTransactions[i].stopLossRate) {
                            console.log("Satisfied 4");


                            walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
                                if (err) {
                                    return err.message;
                                } else {
                                    console.log(updatedData, "RECEIVER WALLET UPDATED");
                                    walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
                                        if (err) {
                                            return err.message;
                                        } else {
                                            console.log(UpdatedData, "SENDER WALLET UPDATED");
                                            Controller.updateTransaction(updateCriteria, (err, NewData) => {
                                                if (err) {
                                                    return err.message;
                                                } else {
                                                    console.log(NewData, "TRANSACTION UPDATED");
                                                    recentlyUpdated = NewData;
                                                    Controller.createTransaction(createCriteria, (err, NewData) => {
                                                        if (err) {
                                                            return err.message;
                                                        } else {
                                                            console.log(NewData, "TRANSACTION CREATED");
                                                            recentlyUpdated = NewData;
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                    return recentlyUpdated;
                }
            } else {
                console.log(`PRICE NOT YET MATCHED`);
                return;
            }

        } else if (receivedTransactions[j].type == "SELL") {
            if (receivedTransactions[j].buyFrom == UpdatedData[i].symbol) {
                if (receivedTransactions[j].stopProfitRate >= UpdatedData[i].buyingPriceUsd) {
                    var criteria = {
                        symbol: receivedTransactions[j].symbol
                    };
                    Service.cryptoServices.fetchOneCryptoData(criteria, {}, {}, (err, details) => {
                        if (err) {
                            return err.message;
                        } else {
                            imageDetail = details
                            var updateCriteria = {
                                case: "STOPLOSS",
                                transactionStatus: "CLOSED",
                                updatedAt: new Date().toISOString(),
                                transactionId: receivedTransactions[j].transactionId,
                            };
                            var createCriteria = {
                                userId: receivedTransactions[j].userId,
                                type: "BUY",
                                dealType: receivedTransactions[j].dealType,
                                buySellRate: "",
                                quantity: receivedTransactions[j].quantity,
                                fees: receivedTransactions[j].fees,
                                buyFrom: receivedTransactions[j].symbol,
                                symbol: receivedTransactions[j].buyFrom,
                                currencyType: "CRYPTO",
                                stopLossRate: 0,
                                stopProfitRate: 0,
                                limitStatus: "LIMIT",
                                limitRate: receivedTransactions[j].limitRate,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                transactionId: "",
                                refTransactionId: receivedTransactions[j].transactionId,
                                amount: receivedTransactions[j].quantity,
                                receiverUserId: receivedTransactions[j].userId,
                                recipientAddress: "",
                                senderAddress: "",
                                currentRate: "",
                                bitgoTransactionId: "",
                                bitgoTransaction: "",
                                bitgoTransactionStatus: "",
                                limitlevel: "",
                                finalAmount: "",
                                recipientEmail: "",
                                paymentProviderId: "",
                                transactionStatus: "CLOSED",
                                margin: "",
                                contractEndTime: "",
                                name: receivedTransactions[j].exchangeCurrencyTo,
                                profitOrLoss: "",
                                img: imageDetail.img,
                                contractTime: "",
                                buyFromQuantity: "",
                                deal: "",
                            };
                            var receiveWalletCriteria = {
                                type: "SENDERSTOPLOSS",
                                userId: receivedTransactions[j].userId,
                                symbol: receivedTransactions[j].symbol,
                                balance: receivedTransactions[j].quantity,
                            };
                            var senderWalletCriteria = {
                                type: "RECEIVERSTOPLOSS",
                                userId: receivedTransactions[j].userId,
                                symbol: receivedTransactions[j].buyFrom,
                                balance: receivedTransactions[j].quantity,
                            };
                            walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
                                if (err) {
                                    return err.message;
                                } else {
                                    console.log(updatedData, "RECEIVER WALLET UPDATED");
                                    walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
                                        if (err) {
                                            return err.message;
                                        } else {
                                            console.log(UpdatedData, "SENDER WALLET UPDATED");
                                            Controller.updateTransaction(updateCriteria, (err, NewData) => {
                                                if (err) {
                                                    return err.message;
                                                } else {
                                                    console.log(NewData, "TRANSACTION UPDATED");
                                                    Controller.createTransaction(createCriteria, (err, NewData) => {
                                                        if (err) {
                                                            return err.message;
                                                        } else {
                                                            console.log(NewData, "TRANSACTION CREATED");
                                                            recentlyUpdated = NewData;
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }

                    })
                    return recentlyUpdated;
                } else {
                    console.log(`PRICE NOT MATCHED`);
                    return;
                }

               
            }
        }}
    }
    return myfunction;
}
const stopLossOrProfit = (callback) => {
    var criteria = {
        transactionStatus: "ACTIVE",
        $or: [{
            stopLossRate: {
                $ne: 0
            }
        }, {
            stopProfitRate: {
                $ne: 0
            }
        }]
    }
    Service.transactionServices.fetchTransaction(criteria, {}, {}, (err, dataReceived) => {
        if (err) {
            return err.message;
        } else {
            receivedTransactions = dataReceived;
            console.log("No of Transactions:", receivedTransactions.length, receivedTransactions);
            if (receivedTransactions.length > 0) {
                Service.cryptoServices.fetchUpdatedCryptoRates((err, updatedData) => {
                    if (err) {
                        if (err.code && err.code == 11000) {
                            return (err.message);
                        }
                        return err;
                    } else {
                        UpdatedData = updatedData;
                        console.log(UpdatedData.length, `Length`);
                        for (var i = 0; i < UpdatedData.length; i++) {
                            for (var j = 0; j < receivedTransactions.length; j++) {
                                var checking = checkStopLossOrProfit(j);
                                var temp = checking(i);
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
            } else {
                return callback(null, {
                    "MESSAGE": "No stopLossOrProfit To Transact"
                });
            }

        }
    })
}

const closeDeal = (data, callback) => {
    var criteria = {
        transactionId: data.transactionId
    }
    Service.transactionServices.fetchTransaction(criteria, {}, {}, (err, transactionData) => {
        if (err) {
            return err.message;
        } else {
            if (transactionData.length > 0) {
                if (transactionData[0].type == "BUY") {
                    var criteria = {
                        symbol: transactionData[0].buyFrom,
                    };
                    // Service.coinMarketServices.fetchOneCurrency(criteria, {}, {}, function (err, liverate) {
                    //     if (err) {
                    //         return err.message;
                    //     } else {
                    //         console.log(liverate, "liverate==================================================");
                    //         switch (transactionData[0].symbol) {
                    //             case "BTC":
                    //                 var balanceToDeposit = (transactionData[0].quantity * liverate.sellrate_BTC);
                    //                 break;
                    //             case "ETH":
                    //                 var balanceToDeposit = (transactionData[0].quantity * liverate.sellrate_ETH);
                    //                 break;
                    //             case "USD":
                    //                 var balanceToDeposit = (transactionData[0].quantity * liverate.sellrate_USD);
                    //                 break;
                    //                 // case "CCD":
                    //                 // var liveRate = liverate.sellrate_CCD;
                    //                 // break;
                    //         }
                    var receiverCriteria = {
                        type: "RECEIVERSTOPLOSS",
                        userId: transactionData[0].userId,
                        symbol: transactionData[0].buyFrom,
                        balance: transactionData[0].quantity,

                    };
                    var senderCriteria = {
                        type: "SENDERSTOPLOSS",
                        userId: transactionData[0].userId,
                        symbol: transactionData[0].buyFrom,
                        balance: transactionData[0].quantity,
                    };
                    var updateCriteria = {
                        case: "STOPLOSS",
                        transactionStatus: "CLOSED",
                        updatedAt: new Date().toISOString(),
                        transactionId: transactionData[0].transactionId,
                    };
                    console.log(receiverCriteria, "receiverCriteria");
                    console.log(senderCriteria, "senderCriteria");
                    console.log(updateCriteria, "updateCriteria");
                    walletController.updateWalletInternalTransfer(receiverCriteria, (err, updatedData) => {
                        if (err) {
                            return err.message;
                        } else {
                            console.log(updatedData, "RECEIVER WALLET UPDATED");
                            walletController.updateWalletInternalTransfer(senderCriteria, (err, UpdatedData) => {
                                if (err) {
                                    return err.message;
                                } else {
                                    console.log(UpdatedData, "SENDER WALLET UPDATED");
                                    Controller.updateTransaction(updateCriteria, (err, NewData) => {
                                        if (err) {
                                            return err.message;
                                        } else {
                                            console.log(NewData, "TRANSACTION UPDATED");
                                        }
                                    })
                                }
                            })
                        }
                    })
                    return callback(null, {
                        "MESSAGE": "DEAL CLOSED"
                    });
                }
                // })
                if (transactionData[0].type == "SELL") {

                    // var criteria = {
                    //     symbol: transactionData[0].symbol,
                    // };
                    // Service.coinMarketServices.fetchOneCurrency(criteria, {}, {}, function (err, liverate) {
                    //     if (err) {
                    //         return err.message;
                    //     } else {
                    //         console.log(liverate, "liverate==================================================");
                    //         switch (transactionData[0].symbol) {
                    //             case "BTC":
                    //                 var balanceToDeposit = (transactionData[0].quantity * liverate.sellrate_BTC);
                    //                 break;
                    //             case "ETH":
                    //                 var balanceToDeposit = (transactionData[0].quantity * liverate.sellrate_ETH);
                    //                 break;
                    //             case "USD":
                    //                 var balanceToDeposit = (transactionData[0].quantity * liverate.sellrate_USD);
                    //                 break;
                    //                 // case "CCD":
                    //          transactionData
                    //          transactionData
                    //         }transactionData
                    var receiverCriteria = {
                        type: "RECEIVERSTOPLOSS",
                        userId: transactionData[0].userId,
                        symbol: transactionData[0].buyFrom,
                        balance: transactionData[0].quantity
                    };
                    var senderCriteria = {
                        type: "SENDERSTOPLOSS",
                        userId: transactionData[0].userId,
                        symbol: transactionData[0].buyFrom,
                        balance: transactionData[0].quantity,
                    };
                    var updateCriteria = {
                        case: "STOPLOSS",
                        transactionStatus: "CLOSED",
                        updatedAt: new Date().toISOString(),
                        transactionId: transactionData[0].transactionId,
                    };
                    walletController.updateWalletInternalTransfer(receiverCriteria, (err, updatedData) => {
                        if (err) {
                            return err.message;
                        } else {
                            console.log(updatedData, "RECEIVER WALLET UPDATED");
                            walletController.updateWalletInternalTransfer(senderCriteria, (err, UpdatedData) => {
                                if (err) {
                                    return err.message;
                                } else {
                                    console.log(UpdatedData, "SENDER WALLET UPDATED");
                                    Controller.updateTransaction(updateCriteria, (err, NewData) => {
                                        if (err) {
                                            return err.message;
                                        } else {
                                            console.log(NewData, "TRANSACTION UPDATED");
                                        }
                                    })
                                }
                            })
                        }
                    })
                    return callback(null, {
                        "MESSAGE": "DEAL CLOSED"
                    });
                }
                // })
            } else {
                console.log("IN 3rd one");
                return callback(null, {
                    "MESSAGE": "NO DEALS FOUND"
                });
            }
        }
    })
}




module.exports = {
    saveDeal: saveDeal,
    transactDeal: transactDeal,
    transactContract: transactContract,
    stopLossOrProfit: stopLossOrProfit,
    closeDeal: closeDeal,
}








///////NEW FUNCTIONALITY FOR PROFIT LOSS AS DISCUSSED ON 05-12-2018///////////////////////////////////////////




// const transactDeal = (callback) => {
//     var buyCriteria = {
//         dealType: "LIMIT",
//         transactionStatus: {
//             $ne: "CLOSED"
//         },
//         limitRate: {
//             $ne: "0"
//         },
//         type:"BUY"
//     }
//     Service.transactionServices.fetchTransaction(buyCriteria, {}, {}, (err, updatedData) => {
//         if (err) {
//             if (err.code && err.code == 11000) {
//                 return (err.message);
//             }
//             return err;
//         } else {
//             UpdatedData = updatedData;
//             //console.log(updatedData, updatedData.length, "+++++++++++++++++++++++++++++++++=")
//             ////////////////////////***********************FETCH ALL PENDING DEALS **************************///////////////////////////////
//             var sellCriteria = {
//                 dealType: "LIMIT",
//                 transactionStatus: {
//                     $ne: "CLOSED"
//                 },
//                 limitRate: {
//                     $ne: "0"
//                 },
//                 type:"SELL",
//             }
//             Service.transactionServices.fetchTransaction(sellCriteria, {}, {}, (err, Data) => {
//                 if (err) {
//                     return err.message;
//                 } else {
//                     transactionData = Data;
//                     // console.log(Data,`Data-=-==-=-=-=-=-=-=-=-=-==========-----------------============`);
//                     //console.log(transactionData,`transactionData-=-==-=-=-=-=-=-=-=-=-==========-----------------============`);
//                     if (transactionData.length > 0) {
//                         for (let i = 0; i < UpdatedData.length; i++) {
//                             //console.log("updatedData[i].symbol", UpdatedData.length, transactionData.length);
//                             //console.log(i, "i");
//                             for (let j = 0; j < transactionData.length; j++) {
//                                 //console.log("Data[j].exchangeCurrencyTo", Data[j].symbol)
//                                 //console.log(j, "j");
//                                 var inserting = checkDeal(j);
//                                 let tempry = inserting(i);
//                                 console.log(inserting, "**********&&ttttttttttttt&&&&&&&&&***********");
//                             }
//                             if (i == 99) {
//                                 console.log("OUT FROM LOOP");
//                                 return callback(null, {
//                                     "MESSAGE": "LOOP COMPLETE"
//                                 });
//                             }
//                         }
//                     }  else {
//                         return callback(null, {
//                             "MESSAGE": "No Deals To Transact"
//                         });

//                     }
//                 }
//             })
//         }
//     })
// }












// const checkDeal = function checkdeal(j) {
//     const myfunction = (i) => {
//         // if (transactionData[j].type == "BUY") {
//         if (UpdatedData[i].symbol == transactionData[j].buyFrom) {
//             console.log(UpdatedData[i].symbol, transactionData[j].buyFrom, i, j, "=============================");
//             if (UpdatedData[i].limitRate >= transactionData[j].limitRate) {
//                 var criteria = {
//                     symbol: UpdatedData[i].symbol
//                 };
//                 Service.cryptoServices.fetchOneCryptoData(criteria, {}, {}, (err, cryptoData) => {
//                     if (err) {
//                         return err.message;
//                     } else {
//                         console.log(cryptoData, `cryptoData==============================`);
// if(cryptoData.buyingPriceUsd <= UpdatedData[i].limitRate && cryptoData.sellingPriceUsd >= transactionData[i].limitRate){
//     if (transactionData[j].buyFromQuantity >= UpdatedData[i].quantity) {
//         var remainingQuantity = transactionData[j].buyFromQuantity - UpdatedData[i].quantity;
//         if(remainingQuantity!= "0"){
// var newQuantityForSell = (transactionData[j].quantity/transactionData[j].buyFromQuantity)*remainingQuantity;
// //var newAmountToDeduct = (transactionData[j].quantity/transactionData[j].buyFromQuantity) *UpdatedData[i].quantity
//         }
//         var newTxId = Math.random().toString(36).substr(2, 16) + Math.random().toString(36).substr(2, 16);
//         var createTransactionCriteria = {
//             userId: transactionData[j].userId,
//             type: "SELL",
//             dealType: transactionData[j].dealType,
//             buySellRate: transactionData[j].buySellRate,
//             quantity: newQuantityForSell,
//             fees: rtransactionData[j].fees,
//             buyFrom: transactionData[j].buyFrom,
//             symbol: transactionData[j].symbol,
//             currencyType: "CRYPTO",
//             stopLossRate:transactionData[j],
//             stopProfitRate: transactionData[j],
//             limitStatus: "LIMIT",
//             limitRate: transactionData[j].limitRate,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//             transactionId: newTxId,
//             refTransactionId: transactionData[j].transactionId,
//             amount: newQuantityForSell,
//             receiverUserId: transactionData[j].receiverUserId,
//             recipientAddress: transactionData[j].recipientAddress,
//             senderAddress: transactionData[j].senderAddress,
//             currentRate: transactionData[j].currentRate,
//             bitgoTransactionId: transactionData[j].bitgoTransactionId,
//             bitgoTransaction:transactionData[j].bitgoTransaction,
//             bitgoTransactionStatus: transactionData[j].bitgoTransactionStatus,
//             limitlevel: transactionData[j].limitlevel,
//             finalAmount:newQuantityForSell,
//             recipientEmail:transactionData[j].recipientEmail,
//             paymentProviderId: transactionData[j].paymentProviderId,
//             transactionStatus: "PENDING",
//             margin: transactionData[j].margin,
//             contractEndTime: transactionData[j].contractEndTime,
//             name: transactionData[j].name,
//             profitOrLoss: transactionData[j].profitOrLoss,
//             img: transactionData[j].img,
//             contractTime:transactionData[j].contractTime,
//             buyFromQuantity:remainingQuantity,
//             deal: transactionData[j].deal,
//         };
//         var sellTransactionCriteria = {
//             transactionId: transactionData[j].transactionId,
//             amount: transactionData[j].buyFromQuantity,
//             receiverUserId: transactionData[j].userId,
//             recipientAddress: walletDetails[0].wallet[0].publicAddress,
//             senderAddress: "",
//             limitRate: transactionData[j].limitRate,
//             updatedAt: new Date().toISOString(),
//             bitgoTransactionId: "INTERNAL TRANSFER",
//             bitgoTransaction: "INTERNAL TRANSFER",
//             bitgoTransactionStatus: "INTERNAL TRANSFER",
//             finalAmount: transactionData[j].quantity,
//             transactionStatus: "CLOSED",
//             buyFromQuantity: UpdatedData[i].amount ,
//         };
//         var buyTransactionCriteria = {
//             transactionId: UpdatedData[i].transactionId,
//             amount: UpdatedData[i].amount,
//             receiverUserId: UpdatedData[i].userId,
//             recipientAddress: UpdatedData[i],
//             senderAddress: "",
//             limitRate: UpdatedData[i].limitRate,
//             updatedAt: new Date().toISOString(),
//             bitgoTransactionId: "INTERNAL TRANSFER",
//             bitgoTransaction: "INTERNAL TRANSFER",
//             bitgoTransactionStatus: "INTERNAL TRANSFER",
//             finalAmount: UpdatedData[i].quantity,
//             transactionStatus: "CLOSED",
//             buyFromQuantity: UpdatedData[i].buyFromQuantity,
//         }
//         var receiveWalletCriteria = {
//             type: "RECEIVER",
//             userId: transactionData[j].userId,
//             symbol: transactionData[j].symbol,
//             balance: transactionData[j].quantity,
//             sETHBalance: 0,
//             sBTCBalance: 0,
//             sUSDBalance: 0,
//             sINRBalance: 0,
//             fees: "1",
//         };
//         var senderWalletCriteria = {
//             type: "SENDER",
//             userId: transactionData[j].userId,
//             symbol: transactionData[j].buyFrom,
//             balance: remainingBalance,
//         };
//     }
//     }
// }

//                     }
//                 })

//                 if (transactionData[j].buyFrom >= UpdatedData[i].quantity) {
//                     //console.log("ININUpdatedData[i]UpdatedData[i]UpdatedData[i]UpdatedData[i]UpdatedData[i]",UpdatedData[i]);

//                     var criteria = {
//                         userId: transactionData[j].userId
//                     };
//                     var projection = {
//                         wallet: {
//                             $elemMatch: {
//                                 symbol: transactionData[j].buyFrom
//                             }
//                         },
//                     }
//                     //console.log(transactionData[j].buyFrom, j, "INSIDE BUYFROM====================");
//                     Service.walletServices.fetchWalletDetails(criteria, projection, (err, walletDetails) => {
//                         if (err) {
//                             return err.message;
//                         } else {
//                             // console.log(j, "BUYFROM====================");
//                             var BuyFrom = transactionData[j].buyFrom;
//                             var requiredBalance;
//                             switch (BuyFrom) {
//                                 case "BTC":
//                                     var requiredBalance = transactionData[j].quantity * UpdatedData[i].buyingPriceBtc;
//                                     break;
//                                 case "ETH":
//                                     var requiredBalance = transactionData[j].quantity * UpdatedData[i].buyingPriceEth;
//                                     break;
//                                 case "USDT":
//                                     var requiredBalance = transactionData[j].quantity * UpdatedData[i].buyingPriceUsd;
//                                     break;
//                                     // case "CCD":
//                                     //     var requiredBalance = Data[j].quantity * updatedData[i].price_btc
//                                     //     break;
//                             }
//                             // console.log(requiredBalance, "==========================================================================================")
//                             // console.log(walletDetails[0].wallet[0].balance, "][][][][][][][][][][][][][][][][][][][][]")
//                             if (walletDetails[0].wallet[0].balance >= requiredBalance) {

//                                 if (transactionData[j].stopLossRate == "0" && transactionData[j].stopProfitRate == "0") {
//                                     var remainingBalance = walletDetails[0].wallet[0].balance - requiredBalance;
//                                     if (transactionData[j].buyFrom >= UpdatedData[i].quantity) {
//                                 } else {
//                                     var remainingBalance = walletDetails[0].wallet[0].balance - requiredBalance;
//                                     var transactionCriteria = {
//                                         transactionId: transactionData[j].transactionId,
//                                         amount: transactionData[j].quantity,
//                                         receiverUserId: transactionData[j].userId,
//                                         recipientAddress: walletDetails[0].wallet[0].publicAddress,
//                                         senderAddress: "",
//                                         limitRate: transactionData[j].limitRate,
//                                         updatedAt: new Date().toISOString(),
//                                         bitgoTransactionId: "INTERNAL TRANSFER",
//                                         bitgoTransaction: "INTERNAL TRANSFER",
//                                         bitgoTransactionStatus: "INTERNAL TRANSFER",
//                                         finalAmount: transactionData[j].quantity,
//                                         transactionStatus: "ACTIVE",
//                                         buyFromQuantity: requiredBalance,
//                                     };
//                                     var receiveWalletCriteria = {
//                                         type: "RECEIVER",
//                                         userId: transactionData[j].userId,
//                                         symbol: transactionData[j].symbol,
//                                         balance: transactionData[j].quantity,
//                                         sETHBalance: 0,
//                                         sBTCBalance: 0,
//                                         sUSDBalance: 0,
//                                         sINRBalance: 0,
//                                         fees: "1",
//                                     };
//                                     var senderWalletCriteria = {
//                                         type: "SENDER",
//                                         userId: transactionData[j].userId,
//                                         symbol: transactionData[j].buyFrom,
//                                         balance: remainingBalance,
//                                     };
//                                 }
//                                 // console.log("INSIDE", j);

//                                 Controller.updateTransaction(transactionCriteria, (err, NewData) => {
//                                     if (err) {
//                                         return err.message;
//                                     } else {
//                                         //console.log(NewData, "TRANSACTION UPDATED SUCCESSFULLY");
//                                         walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
//                                             if (err) {
//                                                 return err.message;
//                                             } else {
//                                                 // console.log(updatedData, "RECEIVER WALLET UPDATED");
//                                                 walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
//                                                     if (err) {
//                                                         return err.message;
//                                                     } else {
//                                                         // console.log(UpdatedData, "SENDER WALLET UPDATED");
//                                                         if (updatedData) {
//                                                             // console.log("UpdatedONE")
//                                                         }
//                                                     }
//                                                 })
//                                             }

//                                         })

//                                     }
//                                 })
//                             } else {
//                                 var transactionCriteria = {
//                                     transactionId: transactionData[j].transactionId,
//                                     amount: transactionData[j].quantity,
//                                     receiverUserId: transactionData[j].userId,
//                                     recipientAddress: walletDetails[0].wallet[0].publicAddress,
//                                     senderAddress: "",
//                                     limitRate: "0",
//                                     updatedAt: new Date().toISOString(),
//                                     bitgoTransactionId: "INSUFFICIENT FUNDS",
//                                     bitgoTransaction: "INSUFFICIENT FUNDS",
//                                     bitgoTransactionStatus: "INSUFFICIENT FUNDS",
//                                     finalAmount: transactionData[j].quantity,
//                                     transactionStatus: "CLOSED",
//                                     buyFromQuantity: requiredBalance,
//                                 };
//                                 Controller.updateTransaction(transactionCriteria, (err, NewData) => {
//                                     if (err) {
//                                         return err.message;
//                                     } else {
//                                         console.log(NewData, "TRANSACTION UPDATED SUCCESSFULLY");
//                                         console.log("INSUFFICIENT FUNDS");
//                                     }
//                                 })
//                                 return NewData;
//                             }

//                         }
//                     })
//                 }

//             } else {
//                 console.log("SYMBOL MATCH NAI HUE");
//             }

//         } else {
//             console.log("No Deals Got Matched");
//         }
//         // } else if (transactionData[j].type == "SELL") {
//         //     if (UpdatedData[i].symbol == transactionData[j].buyFrom) {
//         //         console.log(UpdatedData[i].symbol, transactionData[j].buyFrom, i, j, "=============================");
//         //         if (transactionData[j].transactionStatus == "PENDING") {
//         //             console.log("ININ", j);
//         //             if (UpdatedData[i].sellrate_USD >= transactionData[j].limitRate) {
//         //                 var criteria = {
//         //                     userId: transactionData[j].userId
//         //                 };
//         //                 var projection = {
//         //                     wallet: {
//         //                         $elemMatch: {
//         //                             symbol: transactionData[j].buyFrom
//         //                         }
//         //                     },
//         //                 }
//         //                 console.log(transactionData[j].buyFrom, j, "INSIDE BUYFROM====================");
//         //                 Service.walletServices.fetchWalletDetails(criteria, projection, (err, walletDetails) => {
//         //                     if (err) {
//         //                         return err.message;
//         //                     } else {
//         //                         console.log(j, "BUYFROM====================");
//         //                         var Buy = transactionData[j].symbol;
//         //                         switch (Buy) {
//         //                             case "BTC":
//         //                                 var requiredBalance = transactionData[j].quantity * UpdatedData[i].price_btc
//         //                                 break;
//         //                             case "ETH":
//         //                                 var requiredBalance = transactionData[j].quantity * UpdatedData[i].price_eth
//         //                                 break;
//         //                             case "USDT":
//         //                                 var requiredBalance = transactionData[j].quantity * UpdatedData[i].price_usd
//         //                                 break;
//         //                                 // case "CCD":
//         //                                 //     var requiredBalance = Data[j].quantity * updatedData[i].price_btc
//         //                                 //     break;
//         //                         }
//         //                         if (walletDetails[0].wallet[0].balance >= requiredBalance) {
//         //                             console.log("INSIDE", j)
//         //                             var remainingBalance = walletDetails[0].wallet[0].balance - requiredBalance;
//         //                             var transactionCriteria = {
//         //                                 transactionId: transactionData[j].transactionId,
//         //                                 amount: transactionData[j].quantity,
//         //                                 receiverUserId: transactionData[j].userId,
//         //                                 recipientAddress: walletDetails[0].wallet[0].publicAddress,
//         //                                 senderAddress: "",
//         //                                 limitRate: "0",
//         //                                 updatedAt: new Date().toISOString(),
//         //                                 bitgoTransactionId: "INTERNAL TRANSFER",
//         //                                 bitgoTransaction: "INTERNAL TRANSFER",
//         //                                 bitgoTransactionStatus: "INTERNAL TRANSFER",
//         //                                 finalAmount: transactionData[j].quantity,
//         //                                 transactionStatus: "ACTIVE",
//         //                                 buyFromQuantity: requiredBalance,
//         //                             };
//         //                             var receiveWalletCriteria = {
//         //                                 type: "RECEIVER",
//         //                                 userId: transactionData[j].userId,
//         //                                 symbol: transactionData[j].symbol,
//         //                                 balance: transactionData[j].quantity,
//         //                                 sETHBalance: 0,
//         //                                 sBTCBalance: 0,
//         //                                 sUSDBalance: 0,
//         //                                 sINRBalance: 0,
//         //                                 fees: "1",
//         //                             };
//         //                             var senderWalletCriteria = {
//         //                                 type: "SENDER",
//         //                                 userId: transactionData[j].userId,
//         //                                 symbol: transactionData[j].buyFrom,
//         //                                 balance: remainingBalance,
//         //                             };
//         //                             Controller.updateTransaction(transactionCriteria, (err, NewData) => {
//         //                                 if (err) {
//         //                                     return err.message;
//         //                                 } else {
//         //                                     console.log(NewData, "TRANSACTION UPDATED SUCCESSFULLY");
//         //                                     walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
//         //                                         if (err) {
//         //                                             return err.message;
//         //                                         } else {
//         //                                             console.log(updatedData, "RECEIVER WALLET UPDATED");
//         //                                             walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
//         //                                                 if (err) {
//         //                                                     return err.message;
//         //                                                 } else {
//         //                                                     console.log(UpdatedData, "SENDER WALLET UPDATED");
//         //                                                     if (UpdatedData) {
//         //                                                         console.log("UpdatedONE")
//         //                                                     }
//         //                                                 }
//         //                                             })
//         //                                         }
//         //                                     })
//         //                                 }
//         //                             })
//         //                         } else {
//         //                             var transactionCriteria = {
//         //                                 transactionId: transactionData[j].transactionId,
//         //                                 amount: transactionData[j].quantity,
//         //                                 receiverUserId: transactionData[j].userId,
//         //                                 recipientAddress: walletDetails[0].wallet[0].publicAddress,
//         //                                 senderAddress: "",
//         //                                 limitRate: "0",
//         //                                 updatedAt: new Date().toISOString(),
//         //                                 bitgoTransactionId: "INSUFFICIENT FUNDS",
//         //                                 bitgoTransaction: "INSUFFICIENT FUNDS",
//         //                                 bitgoTransactionStatus: "INSUFFICIENT FUNDS",
//         //                                 finalAmount: transactionData[j].quantity,
//         //                                 transactionStatus: "CLOSED",
//         //                                 buyFromQuantity: requiredBalance,
//         //                             };
//         //                             Controller.updateTransaction(transactionCriteria, (err, NewData) => {
//         //                                 if (err) {
//         //                                     return err.message;
//         //                                 } else {
//         //                                     console.log(NewData, "TRANSACTION UPDATED SUCCESSFULLY");
//         //                                     console.log("INSUFFICIENT FUNDS");
//         //                                 }
//         //                             })
//         //                             return NewData;
//         //                         }
//         //                     }
//         //                 })
//         //             }
//         //         }
//         //     } else {
//         //         console.log("NOT FOUND", i, j);
//         //     }
//         // }

//         return UpdatedData;
//     }
//     return myfunction;
// }

// else if (receivedTransactions[i].stopProfitRate != 0) {
//     if (receivedTransactions[i].profitOrLoss < 0) {
//         if (receivedTransactions[i].type == "BUY") {

//             if ((receivedTransactions[i].profitOrLoss) >= receivedTransactions[i].stopProfitRate) {
//                 var updateCriteria = {
//                     case: "STOPLOSS",
//                     transactionStatus: "CLOSED",
//                     updatedAt: new Date().toISOString(),
//                     transactionId: receivedTransactions[i].transactionId,
//                 };
//                 var createCriteria = {
//                     userId: receivedTransactions[i].userId,
//                     type: "SELL",
//                     dealType: receivedTransactions[i].dealType,
//                     buySellRate: "",
//                     quantity: receivedTransactions[i].quantity,
//                     fees: receivedTransactions[i].fees,
//                     buyFrom: receivedTransactions[i].symbol,
//                     symbol: receivedTransactions[i].buyFrom,
//                     currencyType: "CRYPTO",
//                     stopLossRate: 0,
//                     stopProfitRate: 0,
//                     limitStatus: "LIMIT",
//                     limitRate: receivedTransactions[i].limitRate,
//                     createdAt: new Date().toISOString(),
//                     updatedAt: new Date().toISOString(),
//                     transactionId: "",
//                     refTransactionId: receivedTransactions[i].transactionId,
//                     amount: receivedTransactions[i].quantity,
//                     receiverUserId: receivedTransactions[i].userId,
//                     recipientAddress: "",
//                     senderAddress: "",
//                     currentRate: "",
//                     bitgoTransactionId: "",
//                     bitgoTransaction: "",
//                     bitgoTransactionStatus: "",
//                     limitlevel: "",
//                     finalAmount: "",
//                     recipientEmail: "",
//                     paymentProviderId: "",
//                     transactionStatus: "CLOSED",
//                     margin: "",
//                     contractEndTime: "",
//                     name: receivedTransactions[i].exchangeCurrencyTo,
//                     profitOrLoss: "",
//                     img: imageDetail.img,
//                     contractTime: "",
//                     buyFromQuantity: "",
//                     deal: "",
//                 };
//                 var receiveWalletCriteria = {
//                     type: "SENDERSTOPLOSS",
//                     userId: receivedTransactions[i].userId,
//                     symbol: receivedTransactions[i].symbol,
//                     balance: receivedTransactions[i].quantity,
//                 };
//                 var senderWalletCriteria = {
//                     type: "RECEIVERSTOPLOSS",
//                     userId: receivedTransactions[i].userId,
//                     symbol: receivedTransactions[i].buyFrom,
//                     balance: receivedTransactions[i].quantity,
//                 };
//                 walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
//                     if (err) {
//                         return err.message;
//                     } else {
//                         console.log(updatedData, "RECEIVER WALLET UPDATED");
//                         walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
//                             if (err) {
//                                 return err.message;
//                             } else {
//                                 console.log(UpdatedData, "SENDER WALLET UPDATED");
//                                 Controller.updateTransaction(updateCriteria, (err, NewData) => {
//                                     if (err) {
//                                         return err.message;
//                                     } else {
//                                         console.log(NewData, "TRANSACTION UPDATED");
//                                         recentlyUpdated = NewData;
//                                         Controller.createTransaction(createCriteria, (err, NewData) => {
//                                             if (err) {
//                                                 return err.message;
//                                             } else {
//                                                 console.log(NewData, "TRANSACTION CREATED");
//                                                 recentlyUpdated = NewData;
//                                             }
//                                         })
//                                     }
//                                 })
//                             }
//                         })
//                     }
//                 })
//             }
//         } else if (receivedTransactions[i].type == "SELL") {
//             if ((receivedTransactions[i].profitOrLoss) >= receivedTransactions[i].stopProfitRate) {
//                 var updateCriteria = {
//                     case: "STOPLOSS",
//                     transactionStatus: "CLOSED",
//                     updatedAt: new Date().toISOString(),
//                     transactionId: receivedTransactions[i].transactionId,
//                 };
//                 var createCriteria = {
//                     userId: receivedTransactions[i].userId,
//                     type: "BUY",
//                     dealType: receivedTransactions[i].dealType,
//                     buySellRate: "",
//                     quantity: receivedTransactions[i].quantity,
//                     fees: receivedTransactions[i].fees,
//                     buyFrom: receivedTransactions[i].symbol,
//                     symbol: receivedTransactions[i].buyFrom,
//                     currencyType: "CRYPTO",
//                     stopLossRate: 0,
//                     stopProfitRate: 0,
//                     limitStatus: "LIMIT",
//                     limitRate: receivedTransactions[i].limitRate,
//                     createdAt: new Date().toISOString(),
//                     updatedAt: new Date().toISOString(),
//                     transactionId: "",
//                     refTransactionId: receivedTransactions[i].transactionId,
//                     amount: receivedTransactions[i].quantity,
//                     receiverUserId: receivedTransactions[i].userId,
//                     recipientAddress: "",
//                     senderAddress: "",
//                     currentRate: "",
//                     bitgoTransactionId: "",
//                     bitgoTransaction: "",
//                     bitgoTransactionStatus: "",
//                     limitlevel: "",
//                     finalAmount: "",
//                     recipientEmail: "",
//                     paymentProviderId: "",
//                     transactionStatus: "CLOSED",
//                     margin: "",
//                     contractEndTime: "",
//                     name: receivedTransactions[i].exchangeCurrencyTo,
//                     profitOrLoss: "",
//                     img: imageDetail.img,
//                     contractTime: "",
//                     buyFromQuantity: "",
//                     deal: "",
//                 };
//                 var receiveWalletCriteria = {
//                     type: "SENDERSTOPLOSS",
//                     userId: receivedTransactions[i].userId,
//                     symbol: receivedTransactions[i].symbol,
//                     balance: receivedTransactions[i].quantity,
//                 };
//                 var senderWalletCriteria = {
//                     type: "RECEIVERSTOPLOSS",
//                     userId: receivedTransactions[i].userId,
//                     symbol: receivedTransactions[i].buyFrom,
//                     balance: receivedTransactions[i].quantity,
//                 };
//                 walletController.updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
//                     if (err) {
//                         return err.message;
//                     } else {
//                         console.log(updatedData, "RECEIVER WALLET UPDATED");
//                         walletController.updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
//                             if (err) {
//                                 return err.message;
//                             } else {
//                                 console.log(UpdatedData, "SENDER WALLET UPDATED");
//                                 Controller.updateTransaction(updateCriteria, (err, NewData) => {
//                                     if (err) {
//                                         return err.message;
//                                     } else {
//                                         console.log(NewData, "TRANSACTION UPDATED");
//                                         Controller.createTransaction(createCriteria, (err, NewData) => {
//                                             if (err) {
//                                                 return err.message;
//                                             } else {
//                                                 console.log(NewData, "TRANSACTION CREATED");
//                                                 recentlyUpdated = NewData;
//                                             }
//                                         })
//                                     }
//                                 })
//                             }
//                         })
//                     }
//                 })
//             }

//         }
//     }
// }

// }
// }