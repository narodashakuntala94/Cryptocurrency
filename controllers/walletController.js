var Service = require('../services');
var coinMarketData;
var type;
const Config = require('../config');
var path = "http://" + Config.ServerPath;
var request = require('request');
var Controller = require('./transactionController');
var coinController = require('./coinMarketController');
var cryptoController = require('./cryptoController');
var BitGoJS = require('bitgo');
var Parse, walletId;
var neon_js = require('@cityofzion/neon-js');
var wallet = neon_js.wallet;
var api = neon_js.api;
var Neon = neon_js.default;
const etherWallet = require('ethereumjs-wallet');
var bitcoin = require('bgoldjs-lib');
const bch = require('bitcoincashjs');
const bitcoinjs = require('bitcoinjs-lib');
const nem = require("nem-sdk").default;
const WavesAPI = require('@waves/waves-api');
var arkjs = require("arkjs");
var bip39 = require('bip39');
var litecoinOptions = {
    network: bitcoin.networks.litecoin
};
var bitcoinOptions = {
    network: bitcoin.networks.bitcoin
};
var bitcoinGoldOptions = {
    network: bitcoin.networks.bitcoingold
};
var bitgo = new BitGoJS.BitGo({
    env: 'test',
    accessToken: process.env.ACCESS_TOKEN,
});
var bitcore = require('zcash-bitcore-lib');
const RippleKeypairs = require('ripple-keypairs');
////////For updating the WalletDetails on the basis of type ////////
const updateWalletDetails = (data, callback) => {
    data.type = data.type.toUpperCase()
    if (data.type == "DEPOSIT") {
        var bodyforAddMoney = {
            "userId": data.userId,
            "symbol": data.symbol,
            "type": data.type,
            "amount": data.amount
        }
        if (data.symbol == "INR") {
            var criteria = {
                userId: data.userId,
                wallet: {
                    $elemMatch: {
                        symbol: data.symbol
                    }
                },
            }
            var projection = {
                $inc: {
                    "wallet.$.sINRBalance": data.amount
                },
                $set: {
                    paymentProviderId: data.paymentProviderId
                },
            }
        } else if (data.symbol == "USD") {
            var bodyforAddMoney = {
                "userId": data.userId,
                "symbol": data.symbol,
                "type": data.type,
                "amount": data.amount
            }
            var criteria = {
                userId: data.userId,
                wallet: {
                    $elemMatch: {
                        symbol: data.symbol
                    }
                },
            }
            var projection = {
                $inc: {
                    "wallet.$.sUSDBalance": data.amount
                },
                $set: {
                    paymentProviderId: data.paymentProviderId
                },

            }
        }
    } else if (data.type == "WITHDRAW") {
        var bodyforAddMoney = {
            "userId": data.userId,
            "symbol": data.symbol,
            "type": data.type,
            "amount": data.amount
        }
        if (data.symbol == "INR") {
            var criteria = {
                userId: data.userId,
                wallet: {
                    $elemMatch: {
                        symbol: data.symbol,
                        sINRBalance: {
                            $gte: data.amount
                        }
                    }
                },
            }
            var projection = {
                $inc: {
                    "wallet.$.sINRBalance": -(data.amount)
                }
            }
        } else if (data.symbol == "USD") {
            var bodyforAddMoney = {
                "userId": data.userId,
                "symbol": data.symbol,
                "type": data.type,
                "amount": data.amount
            }
            var criteria = {
                userId: data.userId,
                wallet: {
                    $elemMatch: {
                        symbol: data.symbol,
                        sUSDBalance: {
                            $gte: data.amount
                        }
                    }
                },
            }
            var projection = {
                $inc: {
                    "wallet.$.sUSDBalance": -(data.amount)
                }
            }
        }
    }
    Service.walletServices.updateWalletDetails(criteria, projection, (err, newData) => {
        console.log(err, newData);
        if (err) {
            if (err.code && err.code == 11000) {
                return callback(err.message);
            }
            return callback(err);
        } else {
            Controller.addMoney(bodyforAddMoney, (err, data) => {
                if (err) {
                    return err.message;
                } else {
                    console.log(data, "MONEY ADDED")
                }
            })
            return callback(null, newData);
        }
    })
}
////// For saving the wallet details on the basis of userId //////////////////
const SaveWalletDetails = (data, callback) => {
    var criteria = {
        userId: data.userId
    };
    Service.walletServices.fetchWalletDetails(criteria, (err, newData) => {
        if (err) {
            return err.message
        } else {
            console.log(newData, "newdata=====================================================================================")
            console.log(newData.length, "LENGTH==============================");

            if (newData.length == 0) {
                Service.cryptoServices.fetchUpdatedCryptoRates((err, Data) => {
                    if (err) {
                        return err.message;
                    } else {
                        coinMarketData = Data;
                    }
                    console.log("coinmarket", coinMarketData, "============================")
                    if (coinMarketData.length != 0) {
                        var createData = [];
                        // var criteria = {
                        //     name: "INR",
                        //     symbol: "INR",
                        //     paymentProviderId: "",
                        //     sCryptoImage: path + "/INR.png",
                        //     sINRBalance: 0,
                        //     sETHBalance: 0,
                        //     sBTCBalance: 0,
                        //     sUSDBalance: 0,
                        //     sMargin: "0.00",
                        //     sProfitLoss: "0.00",
                        //     privateAddress: "",
                        //     publicAddress: "",
                        //     walletId: "",
                        //     minBalance: 0,
                        //     balance: 0,
                        //     onOrdersBalance: 0,
                        //     sType: "NONCRYPTO",
                        // }
                        // createData.push(criteria);
                        var criteria = {
                            name: "USD",
                            symbol: "USD",
                            paymentProviderId: "",
                            sCryptoImage: path + "/usd.png",
                            sINRBalance: 0,
                            sETHBalance: 0,
                            sBTCBalance: 0,
                            sUSDBalance: 0,
                            sMargin: 0,
                            privateAddress: "",
                            publicAddress: "",
                            sProfitLoss: "0.00",
                            walletId: "",
                            minBalance: 0,
                            balance: 10000,
                            onOrdersBalance: 0,
                            sType: "NONCRYPTO",
                        }
                        createData.push(criteria);
                        // criteria = {
                        //     name: "USDT",
                        //     symbol: "USDT",
                        //     paymentProviderId: "",
                        //     sCryptoImage: path + "/usdt.png",
                        //     sINRBalance: 0,
                        //     sETHBalance: 0,
                        //     sBTCBalance: 0,
                        //     sUSDBalance: 0,
                        //     sMargin: 0,
                        //     privateAddress: "",
                        //     publicAddress: "",
                        //     walletId: "",
                        //     sProfitLoss: 0,
                        //     minBalance: 0,
                        //     balance: 0,
                        //     onOrdersBalance: 0,
                        //     sType: "NONCRYPTO",
                        // }
                        // createData.push(criteria);
                        console.log("inside======", coinMarketData.length);
                        for (var i = 0; i < coinMarketData.length; i++) {
                            criteria = {
                                name: coinMarketData[i].name,
                                symbol: coinMarketData[i].symbol,
                                sCryptoImage: coinMarketData[i].img,
                                sINRBalance: 0,
                                sETHBalance: 0,
                                sBTCBalance: 0,
                                sUSDBalance: 0,
                                sMargin: 0,
                                sProfitLoss: "0.00",
                                paymentProviderId: "",
                                privateAddress: "",
                                publicAddress: "",
                                walletId: "",
                                minBalance: 0,
                                balance: 0,
                                onOrdersBalance: 0,
                                sType: "CRYPTO",
                            };
                            createData.push(criteria);
                        }
                        console.log(createData.length, "====================================length");
                        if (createData.length >= coinMarketData.length) {
                            var criteria = {
                                userId: data.userId,
                                wallet: createData
                            };
                            Service.walletServices.saveWalletDetails(criteria, (err, nData) => {
                                console.log(err, nData);
                                if (err) {
                                    if (err.code && err.code == 11000) {
                                        return callback(err.message);
                                    }
                                    return callback(err);
                                } else {
                                    return callback(null, nData);
                                }
                            })
                        }

                    }
                })
            } else {
                console.log("outsidE 0");
                return callback(null, newData)
            }

        }

    })

}
///// For fetching the data from wallets on the basis of symbol /////////
const fetchWalletDetails = (data, callback) => {
    if (data.symbol == "INR") {
        var projection = {};
        if (data.symbol) {
            var projection = {
                wallet: {
                    $elemMatch: {
                        symbol: data.symbol
                    }
                },
                _id: 0,
                __v: 0,
                'wallet._id': 0
            }
        }
        var criteria = {
            userId: data.userId,
        };
        Service.walletServices.fetchWalletDetails(criteria, projection, (err, newData) => {
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
    } else if (data.symbol == "USD") {
        var projection = {};
        if (data.symbol) {
            var projection = {
                wallet: {
                    $elemMatch: {
                        symbol: data.symbol
                    }
                },
                _id: 0,
                __v: 0,
                'wallet._id': 0
            }
        }
        var criteria = {
            userId: data.userId,
        };
        Service.walletServices.fetchWalletDetails(criteria, projection, (err, newData) => {
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
    } else if (data.symbol && data.walletId) {
        var projection = {};
        if (data.symbol) {
            var projection = {
                wallet: {
                    $elemMatch: {
                        symbol: data.symbol
                    }
                },
                _id: 0,
                __v: 0,
                'wallet._id': 0
            }
        }
        var criteria = {
            userId: data.userId,
        };
        var liveCriteria = {
            symbol: data.symbol
        }
        cryptoController.fetchOneCryptoData(liveCriteria, (err, Data) => {
            if (err) {
                return err;
            } else {
                console.log(Data, "Data=================================")
                Service.walletServices.fetchWalletDetails(criteria, projection, (err, walletData) => {
                    if (err) {
                        return err;
                    } else {
                        var adminCriteria = {
                            symbol: data.symbol
                        }
                        Service.adminServices.fetchOne(adminCriteria, {}, {}, (err, adminData) => {
                            if (err) {
                                return err.message;
                            } else {
                                console.log(adminData.margin, "admindata======");
                                console.log(walletData[0].wallet[0].balance, "walletData++++++++++++++++++++++++++++++++++")
                                var updatedMargin = adminData.margin;
                                var balance = walletData[0].wallet[0].balance;
                                var sETHBalance = balance * Data.buyingPriceEth;
                                var sBTCBalance = balance * Data.buyingPriceBtc;
                                var sINRBalance = balance * Data.buyingPriceCcd;
                                var sUSDBalance = balance * Data.buyingPriceUsd;
                                var marginBalance = balance * updatedMargin;
                                var updateCriteria = {
                                    userId: data.userId,
                                    wallet: {
                                        $elemMatch: {
                                            symbol: data.symbol,

                                        },
                                    }
                                }
                                var updateProjection = {
                                    $set: {
                                        "wallet.$.sETHBalance": sETHBalance,
                                        "wallet.$.sBTCBalance": sBTCBalance,
                                        "wallet.$.sUSDBalance": sUSDBalance,
                                        "wallet.$.sINRBalance": sINRBalance,
                                        "wallet.$.balance": balance,
                                        "wallet.$.sMargin": marginBalance,
                                    },
                                }
                                Service.walletServices.updateWalletDetails(updateCriteria, updateProjection, (err, UpdatedData) => {
                                    if (err) {
                                        return err.message;
                                    } else {
                                        console.log(UpdatedData, "UpdatedData=============================");
                                        var criteria = {
                                            userId: data.userId
                                        };
                                        var projection = {
                                            wallet: {
                                                $elemMatch: {
                                                    symbol: data.symbol
                                                }
                                            },
                                            _id: 0,
                                            __v: 0,
                                            'wallet._id': 0
                                        }
                                        Service.walletServices.fetchWalletDetails(criteria, projection, (err, finalData) => {
                                            if (err) {
                                                return callback(err.message);
                                            } else {
                                                return callback(null, finalData);
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

        // bitgo.coin(symbol).wallets().get({
        //         id: data.walletId
        //     })
        //     .then(function (wallet) {
        //         // print the wallet
        //         var intoString = JSON.stringify(wallet);
        //         Parse = JSON.parse(intoString)
        //         var updateCriteria = {
        //             userId: data.userId,
        //             wallet: {
        //                 $elemMatch: {
        //                     walletId: data.walletId,

        //                 },
        //             }
        //         }
        //         var updateProjection = {
        //             $set: {
        //                 "wallet.$.publicAddress": Parse._wallet.receiveAddress.address,
        //             },
        //             $inc: {
        //                 "wallet.$.balance": Parse._wallet.balance * 0.00000001,
        //             }
        //         }
        //         // console.log(Parse._wallet.balance,Parse._wallet.receiveAddress.address,"++++++_+_+_+__+_+_+");
        //         Service.walletServices.updateWalletDetails(updateCriteria, updateProjection, function (err, updatedData) {
        //             if (err) {
        //                 return callback(err);
        //             } else {
        //                 console.log(updatedData, "updatedData");
        //             }
        //             Service.walletServices.fetchWalletDetails(criteria, projection, function (err, newData) {
        //                 console.log(err, newData);
        //                 if (err) {
        //                     if (err.code && err.code == 11000) {
        //                         return callback(err.message);
        //                     }
        //                     return callback(err);
        //                 } else {
        //                     return callback(null, newData);
        //                 }
        //             })
        //         })
        //     }).catch((err) => {
        //         throw new Error('Higher-level error. ' + err.message);
        //         return callback(err);
        //     })

    } else {
        var projection = {};
        if (data.symbol) {
            var projection = {
                wallet: {
                    $elemMatch: {
                        symbol: data.symbol
                    }
                },
                _id: 0,
                __v: 0,
                'wallet._id': 0
            }
        }
        var criteria = {
            userId: data.userId,
        };
        Service.walletServices.fetchWalletDetails(criteria, projection, (err, newData) => {
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
const updateWalletInternalTransfer = (data, callback) => {
    var criteria = {
        userId: data.userId,
        wallet: {
            $elemMatch: {
                symbol: data.symbol,

            },
        }
    };
    if (data.type == "SENDER") {
        var projection = {
            $set: {
                "wallet.$.balance": data.balance,
            },
        };
    } else if (data.type == "RECEIVER") {
        var projection = {
            $set: {
                "wallet.$.sETHBalance": data.sETHBalance,
                "wallet.$.sBTCBalance": data.sBTCBalance,
                "wallet.$.sUSDBalance": data.sUSDBalance,
                "wallet.$.sINRBalance": data.sINRBalance,
            },
            $inc: {
                "wallet.$.minBalance": data.fees,
                "wallet.$.onOrdersBalance": data.balance,
            },
        };
    } else if (data.type == "DEALRECEIVER") {
        var projection = {
            $set: {
                "wallet.$.sETHBalance": data.sETHBalance,
                "wallet.$.sBTCBalance": data.sBTCBalance,
                "wallet.$.sUSDBalance": data.sUSDBalance,
                "wallet.$.sINRBalance": data.sINRBalance,
            },
            $inc: {
                "wallet.$.minBalance": data.fees,
                "wallet.$.balance": data.balance,
            },
        };
    } else if (data.type == "DEALSENDER") {
        var projection = {
            $set: {
                "wallet.$.balance": data.balance,
            },
        };
    } else if (data.type == "SENDERCONTRACT") {
        var projection = {
            $inc: {
                "wallet.$.balance": -(data.balance),
            },
        };
    } else if (data.type == "SENDERCONTRACTEND") {
        var projection = {
            $inc: {
                "wallet.$.balance": data.balance,
            },
        };
    } else if (data.type == "MARKETRECEIVER") {
        var projection = {
            $set: {
                "wallet.$.sETHBalance": data.sETHBalance,
                "wallet.$.sBTCBalance": data.sBTCBalance,
                "wallet.$.sUSDBalance": data.sUSDBalance,
                "wallet.$.sINRBalance": data.sINRBalance,
            },
            $inc: {
                "wallet.$.minBalance": data.fees,
                "wallet.$.onOrdersBalance": data.balance,
            },
        };
    } else if (data.type == " SENDERSTOPLOSS") {
        var projection = {
            $inc: {
                "wallet.$.onOrdersBalance": -data.balance,
            },
        };
    } else if (data.type == " RECEIVERSTOPLOSS") {
        var projection = {
            $inc: {
                "wallet.$.balance": data.balance,
            },
        };
    }
    console.log(typeof data.balance, "TYPEOF:")
    Service.walletServices.updateWalletDetails(criteria, projection, (err, newData) => {
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
const fetchWalletDetailsINR = (data, callback) => {
    var projection = {};
    if (data.symbol) {
        var projection = {
            wallet: {
                $elemMatch: {
                    symbol: data.symbol
                }
            },
            _id: 0,
            __v: 0,
            'wallet._id': 0
        }
    }
    var criteria = {
        userId: data.userId,
    };
    Service.walletServices.fetchWalletDetails(criteria, projection, (err, newData) => {
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
const sendCoins = (data, callback) => {
    var recieverUserId = "";
    switch (data.symbol) {
        case "XRP":
            var symbol = "txrp"
            break;
        case "BTC":
            var symbol = "tbtc"
            break;
        case "BCH":
            var symbol = "tbch"
            break;
        case "LTC":
            var symbol = "tltc"
            break;
        case "ETH":
            var symbol = "teth"
            break;
    }
    var sendercriteria = {
        userId: data.userId,
        wallet: {
            $elemMatch: {
                symbol: data.symbol,
            }
        }
    }
    Service.walletServices.fetchWalletDetails(sendercriteria, {}, (err, NewData) => {
        if (err) {
            return err;
        } else {
            console.log(NewData, "=====NEWDTATATATATA============")
        }
    })
    let params = {
        amount: (data.amount * 1e8),
        address: data.recieverAddress,
        walletPassphrase: 'secretpassphrase1a5df8380e0e30'
    };
    var fetchCriteria = {
        wallet: {
            $elemMatch: {
                publicAddress: data.recieverAddress
            }
        }
    }
    var fetchProjection = {};
    Service.walletServices.fetchWalletDetails(fetchCriteria, fetchProjection, (err, Data) => {
        if (err) {
            console.log(err.message);
            return err;
        } else {
            if (Data.length != 0) {
                console.log(Data, "=================");
                recieverUserId = Data[0].userId;
                var receiverWalletId = Data[0].wallet[0].walletId;
                console.log(Data[0].userId, "USERID====================================");
                console.log(Data[0].wallet[0].walletId, "walletID====================================");
            }
            bitgo.coin(symbol).wallets().get({
                    id: data.walletId
                })
                .then((wallet) => {
                    // print the wallet
                    console.dir(wallet);
                    var intoString = JSON.stringify(wallet);
                    Parse = JSON.parse(intoString)
                    wallet.send(params)
                        .then((transaction) => {
                            // print transaction details
                            console.log(transaction, "TRANSACTION========");
                            var transactionIntoString = JSON.stringify(transaction);
                            var transactionParse = JSON.parse(transactionIntoString)
                            console.log(transactionParse, "transactionParse")
                            var criteria = {
                                receiverUserId: recieverUserId,
                                amount: data.amount,
                                type: data.type,
                                symbol: data.symbol,
                                userId: data.userId,
                                recipientAddress: data.recieverAddress,
                                senderAddress: Parse._wallet.receiveAddress.address,
                                bitgoTransactionId: transactionParse.txid,
                                bitgoTransaction: transactionParse.tx,
                                bitgoTransactionStatus: transactionParse.status,
                            };
                            Controller.createTransaction(criteria, (err, newData) => {
                                console.log(err, newData);
                                if (err) {
                                    if (err.code && err.code == 11000) {
                                        return callback(err.message);
                                    }
                                    return callback(err);
                                } else {
                                    ///////FETCH BALANCE ON THE BASIS OF WALLET ID AND ADD IN THE PREVIOUS BALANCE IF ANY/////
                                    bitgo.coin(symbol).wallets().get({
                                            id: receiverWalletId
                                        })
                                        .then((wallet) => {
                                            // print the wallet
                                            var intoString = JSON.stringify(wallet);
                                            Parse = JSON.parse(intoString)
                                            var updateCriteria = {
                                                userId: data.userId,
                                                wallet: {
                                                    $elemMatch: {
                                                        symbol: data.symbol,
                                                    },
                                                }
                                            }
                                            var balanceToUpdate = Parse._wallet.balance * 0.00000001
                                            var updateProjection = {
                                                $set: {
                                                    "wallet.$.publicAddress": Parse._wallet.receiveAddress.address,
                                                },
                                                $inc: {
                                                    "wallet.$.balance": balanceToUpdate,
                                                }
                                            }
                                            Service.walletServices.updateWalletDetails(updateCriteria, updateProjection, (err, updatedData) => {
                                                if (err) {
                                                    return callback(err);
                                                } else {
                                                    console.log(updatedData, " Successfully updatedData");
                                                }

                                            })
                                        }).catch((err) => {
                                            return callback(err.message);
                                        })
                                    return callback(null, newData);
                                }
                            })

                        }).catch((err) => {
                            return callback(err.message);

                        })
                }).catch((err) => {
                    return callback(err.message);
                })
        }
    })

}
const createWalletAddress = (data, callback) => {
    // if (data.symbol != "XRP" || data.symbol != "LTC" || data.symbol != "BTC" || data.symbol != "BCH" || data.symbol != "ETH") {
    //Switch
    switch (data.symbol) {
        case "BTC":
            var keyPair = bitcoin.ECPair.makeRandom(bitcoinOptions)
            var walletAddress = keyPair.getAddress();
            var privKey = keyPair.toWIF();
            break;
        case "ETH":
            var erc20 = "ERC20";
            var ethereumWallet = etherWallet.generate();
            var walletAddress = ethereumWallet.getAddressString()
            var privKey = ethereumWallet.getPrivateKey;
            break;
        case "XRP":
            var seed = RippleKeypairs.generateSeed()
            const keypair = RippleKeypairs.deriveKeypair(seed);
            var walletAddress = RippleKeypairs.deriveAddress(keypair.publicKey);
            var privKey = seed;
            break;
        case "BCH":
            var bchPrivateKey = new bch.PrivateKey();
            var bchAddress = (bchPrivateKey.toAddress()).toString();
            var bchaddress = bch.Address;
            //var BitpayFormat = bchaddress.BitpayFormat;
            var CashAddrFormat = bchaddress.CashAddrFormat;
            var wAddress = new bchaddress(bchAddress);
            var walletAddress = (wAddress.toString(CashAddrFormat)).substr(12);
            var privKey = bchPrivateKey.toWIF();
            break;
        case "CCD":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "EOS":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "LTC":
            var keyPair = bitcoin.ECPair.makeRandom(litecoinOptions)
            var walletAddress = keyPair.getAddress();
            var privKey = keyPair.toWIF();
            break;
        case "ADA":
            var walletAddress = "NOT YET FOUND";
            break;
        case "XLM":
            var walletAddress = "NOT YET FOUND";
            break;
        case "MIOTA":
            var walletAddress = "NOT YET FOUND";
            break;
        case "NEO":
            var privateKey = Neon.create.privateKey();
            var publicKey = wallet.getPublicKeyFromPrivateKey(privateKey);
            var scriptHash = wallet.getScriptHashFromPublicKey(publicKey);
            var walletAddress = wallet.getAddressFromScriptHash(scriptHash);
            var privKey = privateKey;
            break;
        case "TRX":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "XMR":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "DASH":
            const dash = bitcoinjs.networks.bitcoin;
            // dash.pubKeyHash = 0x4c; dash.wif = 0xcc; dash.scriptHash = 0x10;
            dash.pubKeyHash = 0x8c;
            dash.wif = 0xcc;
            dash.scriptHash = 0x13;
            const dashKeyPair = bitcoinjs.ECPair.makeRandom();
            var {
                address
            } = bitcoinjs.payments.p2pkh({
                pubkey: dashKeyPair.publicKey,
                network: dash
            });
            var walletAddress = address;
            var privKey = dashKeyPair.toWIF();
            console.log({
                address
            }, "DASH ADRESS==============================================================");
            break;
        case "XEM":
            var rBytes = nem.crypto.nacl.randomBytes(32);
            var rHex = nem.utils.convert.ua2hex(rBytes);
            var nemKeyPair = nem.crypto.keyPair.create(rHex);
            var walletAddress = nem.model.address.toAddress(nemKeyPair.publicKey.toString(), nem.model.network.data.mainnet.id)
            var privKey = rHex;
            break;
        case "USDT":
            var walletAddress = "NOT YET FOUND";
            break;
        case "OMG":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "VEN":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "ETC":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "QTUM":
            const qtum = bitcoinjs.networks.bitcoin;
            qtum.pubKeyHash = 120;
            qtum.wif = 239;
            qtum.scriptHash = 110;
            // qtum.pubKeyHash = 0x3A; qtum.wif = 0x80; qtum.scriptHash = 0x32;
            const qtumKeyPair = bitcoinjs.ECPair.makeRandom();
            var {
                address
            } = bitcoinjs.payments.p2pkh({
                pubkey: qtumKeyPair.publicKey,
                network: qtum
            })
            var privKey = qtumKeyPair.toWIF();
            var walletAddress = address;
            break;
        case "EMC":
            const emc = bitcoinjs.networks.bitcoin;
            emc.pubKeyHash = 0x21;
            emc.wif = 0x80;
            emc.scriptHash = 0x5;
            var emcKeyPair = bitcoinjs.ECPair.makeRandom();
            var {
                address
            } = bitcoinjs.payments.p2pkh({
                pubkey: emcKeyPair.publicKey,
                network: emc
            })
            var privKey = emcKeyPair.toWIF();
            var walletAddress = address;
            break;
        case "BNB":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "ICX":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "BTG":
            var keyPair = bitcoin.ECPair.makeRandom(bitcoinGoldOptions)
            var walletAddress = keyPair.getAddress();
            var privKey = keyPair.toWIF();
            break;
        case "LSK":
            var walletAddress = "NOT YET FOUND";
            break;
        case "PAY":
            var erc20 = "ERC20";
            break;
        case "DCN":
            var erc20 = "ERC20";
            break;
        case "MANA":
            var erc20 = "ERC20";
            break;
        case "POLY":
            var erc20 = "ERC20";
            break;
        case "DROP":
            var erc20 = "ERC20";
            break;
        case "HOT":
            var erc20 = "ERC20";
            break;
        case "ZEC":
            var privateKey = new bitcore.PrivateKey();
            var address = privateKey.toAddress();
            var walletAddress = String(address);
            var privKey = privateKey.toWIF();
            break;
        case "XVG":
            const xvg = bitcoinjs.networks.bitcoin;
            xvg.pubKeyHash = 0x1e;
            xvg.wif = 0x9e;
            xvg.scriptHash = 0x21;
            const xvgKeyPair = bitcoinjs.ECPair.makeRandom();
            var {
                address
            } = bitcoinjs.payments.p2pkh({
                pubkey: xvgKeyPair.publicKey,
                network: xvg
            })
            var privKey = xvgKeyPair.toWIF();
            var walletAddress = address;
            break;
        case "STEEM":
            var walletAddress = "NOT YET FOUND";
            break;
        case "BTM":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "BTCP":
            var walletAddress = "NOT YET FOUND";
            break;
        case "NANO":
            var walletAddress = "NOT YET FOUND";
            break;
        case "BCN":
            var walletAddress = "NOT YET FOUND";
            break;
        case "PPT":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "WAN":
            var walletAddress = "NOT YET FOUND";
            break;
        case "SC":
            var walletAddress = "NOT YET FOUND";
            break;
        case "BTS":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "BCD":
            var walletAddress = "NOT YET FOUND";
            break;
        case "ZIL":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "ONT":
            var privateKey = Neon.create.privateKey();
            var publicKey = wallet.getPublicKeyFromPrivateKey(privateKey);
            var scriptHash = wallet.getScriptHashFromPublicKey(publicKey);
            var walletAddress = wallet.getAddressFromScriptHash(scriptHash);
            var privKey = privateKey;
            break;
        case "AE":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "MKR":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "DOGE":
            const doge = bitcoinjs.networks.bitcoin;
            doge.pubKeyHash = 0x1e;
            doge.wif = 0x9e;
            doge.scriptHash = 0x16; ////(FOR MAINNET)
            //doge.pubKeyHash = 0x71;doge.wif = 0xf1; doge.scriptHash = 0xc4; //////(FOR TESTNET)
            const dogeKeyPair = bitcoinjs.ECPair.makeRandom();
            var {
                address
            } = bitcoinjs.payments.p2pkh({
                pubkey: dogeKeyPair.publicKey,
                network: doge
            });
            var walletAddress = address;
            var privKey = dogeKeyPair.toWIF();
            break;
        case "DCR":
            var walletAddress = "NOT YET FOUND";
            break;
        case "STRAT":
            var walletAddress = "NOT YET FOUND";
            break;
        case "ZRX":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "XIN":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "DGD":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "WAVES":
            const Waves = WavesAPI.create(WavesAPI.MAINNET_CONFIG);
            var seed = Waves.Seed.create();
            var walletAddress = seed.address;
            var privateKey = seed.keyPair.privateKey
            var privKey = privateKey;
            break;
        case "RHOC":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "SNT":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "AION":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "GNT":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "REP":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "LRC":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "BAT":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "KNC":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "HSR":
            var walletAddress = "NOT YET FOUND";
            break;
        case "WTC":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "IOST":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "KMD":
            const kmd = bitcoinjs.networks.bitcoin;
            kmd.pubKeyHash = 0x3c;
            kmd.wif = 0xbc;
            kmd.scriptHash = 0x55;
            const komodoKeyPair = bitcoinjs.ECPair.makeRandom();
            var {
                address
            } = bitcoinjs.payments.p2pkh({
                pubkey: komodoKeyPair.publicKey,
                network: kmd
            })
            var privKey = komodoKeyPair.toWIF();
            var walletAddress = address;
            break;
        case "ARDR":
            var walletAddress = "NOT YET FOUND";
            break;
        case "DGB":
            const dgb = bitcoinjs.networks.bitcoin;
            dgb.pubKeyHash = 0x1e;
            dgb.wif = 0x80;
            dgb.scriptHash = 0x05;
            const dgbKeyPair = bitcoinjs.ECPair.makeRandom();
            var {
                address
            } = bitcoinjs.payments.p2pkh({
                pubkey: dgbKeyPair.publicKey,
                network: dgb
            });
            var privKey = dgbKeyPair.toWIF();
            var walletAddress = address;
            break;
        case "KCS":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "ARK":
            var networks = arkjs.networks
            var passphrase = bip39.generateMnemonic()
            var ecpair = arkjs.ECPair.fromSeed(passphrase, networks.ark)
            var address = ecpair.getAddress().toString('hex')
            var privKey = ecpair.toWIF()
            var walletAddress = address;
            break;
        case "CENNZ":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "PIVX":
            const pivx = bitcoinjs.networks.bitcoin;
            pivx.pubKeyHash = 0x1E;
            pivx.wif = 0xD4;
            pivx.scriptHash = 0xD;
            const pivxKeyPair = bitcoinjs.ECPair.makeRandom();
            var {
                address
            } = bitcoinjs.payments.p2pkh({
                pubkey: pivxKeyPair.publicKey,
                network: pivx
            })
            var privKey = pivxKeyPair.toWIF();
            var walletAddress = address;
            break;
        case "SYS":
            var walletAddress = "NOT YET FOUND";
            break;
        case "MITH":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "SUB":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "ELF":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "MONA":
            const mona = bitcoinjs.networks.bitcoin;
            mona.pubKeyHash = 0x32;
            mona.wif = 0xb0;
            mona.scriptHash = 0x37;
            const monaKeyPair = bitcoinjs.ECPair.makeRandom();
            var {
                address
            } = bitcoinjs.payments.p2pkh({
                pubkey: monaKeyPair.publicKey,
                network: mona
            })
            var privKey = monaKeyPair.toWIF();
            var walletAddress = address;
            break;
        case "CNX":
            var walletAddress = "NOT YET FOUND";
            break;
        case "DRGN":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "STORM":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "GAS":
            var privateKey = Neon.create.privateKey();
            var publicKey = wallet.getPublicKeyFromPrivateKey(privateKey);
            var scriptHash = wallet.getScriptHashFromPublicKey(publicKey);
            var walletAddress = wallet.getAddressFromScriptHash(scriptHash);
            var privKey = privateKey.toWIF();
            break;
        case "QASH":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "DNC":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "ETHOS":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "FCT":
            var walletAddress = "NOT YET FOUND";
            break;
        case "NPXS":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "NAS":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "CTXC":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "VERI":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "BNT":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "RDD":
            const rdd = bitcoinjs.networks.bitcoin;
            rdd.pubKeyHash = 0x3d;
            rdd.wif = 0xbd;
            rdd.scriptHash = 0x05;
            // rdd.pubKeyHash = 0x6f; rdd.wif = 0xef; rdd.scriptHash = 0xc4;
            const rddKeyPair = bitcoinjs.ECPair.makeRandom();
            var {
                address
            } = bitcoinjs.payments.p2pkh({
                pubkey: rddKeyPair.publicKey,
                network: rdd
            })
            var privKey = rddKeyPair.toWIF();
            var walletAddress = address;
            break;
        case "FUN":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "GXS":
            var walletAddress = "NOT YET FOUND";
            break;
        case "ELA":
            var walletAddress = "NOT YET FOUND";
            break;
        case "SALT":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "XZC":
            var walletAddress = "NOT YET FOUND";
            break;
        case "NXT":
            var walletAddress = "NOT YET FOUND";
            break;
        case "WAX":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "KIN":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "POWR":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "MCO":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "Revain":
            var walletAddress = "NOT YET FOUND";
            break;
        case "ENG":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "ETN":
            var walletAddress = "NOT YET FOUND";
            break;
        case "GBYTE":
            var walletAddress = "NOT YET FOUND";
            break;
        case "NCASH":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "MAID":
            var erc20 = "ERC20";
            break;
        case "LINK":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "GTO":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "CMT":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "FSN":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "HT":
            var walletAddress = "NOT YET FOUND";
            break;
        case "LOOM":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "MOAC":
            var walletAddress = "NOT YET FOUND";
            break;
        case "SKY":
            var walletAddress = "NOT YET FOUND";
            break;
        case "THETA":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        case "NULS":
            var erc20 = "ERC20";
            // var ethereumWallet = etherWallet.generate();
            // var walletAddress = ethereumWallet.getAddressString();
            break;
        default:
            var walletAddress = "1";
            var privKey = "default"
            break;
    }
    if (erc20 == "ERC20") {
        var criteria = {
            userId: data.userId
        }
        var projection = {
            wallet: {
                $elemMatch: {
                    symbol: "ETH"
                }
            },
        }
        Service.walletServices.fetchWalletDetails(criteria, projection, (err, Data) => {
            if (err) {
                if (err.code && err.code == 11000) {
                    return (err.message);
                }
                return (err);
            } else {
                console.log("Data.wallets.publicAddress:->", Data[0].wallet[0].publicAddress)
                if (Data[0].wallet[0].publicAddress != "") {
                    var criteria = {
                        userId: data.userId,
                        wallet: {
                            $elemMatch: {
                                symbol: data.symbol,
                            },
                        }
                    }
                    var projection = {
                        $set: {
                            "wallet.$.publicAddress": Data[0].wallet[0].publicAddress,
                            "wallet.$.walletId": Data[0].wallet[0].publicAddress,
                        },
                    }
                    Service.walletServices.updateWalletDetails(criteria, projection, (err, newData) => {
                        console.log(err, newData);
                        if (err) {
                            if (err.code && err.code == 11000) {
                                return callback(err.message);
                            }
                            return callback(err);
                        } else {
                            console.log(newData.n, "newData.n")
                            var criteria = {
                                userId: data.userId
                            }
                            var projection = {
                                wallet: {
                                    $elemMatch: {
                                        symbol: data.symbol
                                    }
                                },
                            }
                            Service.walletServices.fetchWalletDetails(criteria, projection, (err, Datafetched) => {
                                if (err) {
                                    if (err.code && err.code == 11000) {
                                        return callback(err.message);
                                    }
                                    return callback(err);
                                } else {
                                    return callback(null, Datafetched);
                                }
                            })
                        }
                    })
                } else {
                    var ethereumWallet = etherWallet.generate();
                    var walletAddress = ethereumWallet.getAddressString();
                    var criteria = {
                        userId: data.userId,
                        wallet: {
                            $elemMatch: {
                                symbol: "ETH",
                            },
                        }
                    };
                    var projection = {
                        $set: {
                            "wallet.$.privateAddress": privKey,
                            "wallet.$.publicAddress": walletAddress,
                            "wallet.$.walletId": walletAddress,
                        },
                    }
                    Service.walletServices.updateWalletDetails(criteria, projection, (err, newData) => {
                        console.log(err, newData);
                        if (err) {
                            if (err.code && err.code == 11000) {
                                return callback(err.message);
                            }
                            return callback(err);
                        } else {
                            console.log(newData.n, "newData.n else m")
                            var criteria = {
                                userId: data.userId,
                                wallet: {
                                    $elemMatch: {
                                        symbol: data.symbol,
                                    },
                                }
                            };
                            var projection = {
                                $set: {
                                    "wallet.$.privateAddress": privKey,
                                    "wallet.$.publicAddress": walletAddress,
                                    "wallet.$.walletId": walletAddress,
                                },
                            }
                            Service.walletServices.updateWalletDetails(criteria, projection, (err, newData) => {
                                console.log(err, newData);
                                if (err) {
                                    if (err.code && err.code == 11000) {
                                        return callback(err.message);
                                    }
                                    return callback(err);
                                } else {
                                    console.log(newData.n, "newData.n else m");
                                    var criteria = {
                                        userId: data.userId
                                    }
                                    var projection = {
                                        wallet: {
                                            $elemMatch: {
                                                symbol: data.symbol
                                            }
                                        },
                                    }
                                    Service.walletServices.fetchWalletDetails(criteria, projection, (err, Datafetched) => {
                                        if (err) {
                                            if (err.code && err.code == 11000) {
                                                return callback(err.message);
                                            }
                                            return callback(err);
                                        } else {
                                            return callback(null, Datafetched);
                                        }
                                    })
                                }
                            })
                        }
                    })

                }
            }
        })
    } else {
        var criteria = {
            userId: data.userId,
            wallet: {
                $elemMatch: {
                    symbol: data.symbol,
                },
            }
        }
        var projection = {
            $set: {
                "wallet.$.privateAddress": privKey,
                "wallet.$.publicAddress": walletAddress,
                "wallet.$.walletId": walletAddress,
            },
        }
        Service.walletServices.updateWalletDetails(criteria, projection, (err, newData) => {
            console.log(err, newData);
            if (err) {
                if (err.code && err.code == 11000) {
                    return callback(err.message);
                }
                return callback(err);
            } else {
                console.log(newData.n, "newData.n")
                if (newData.n == '0') {
                    return callback(null, newData);
                }
                var criteria = {
                    userId: data.userId
                }
                var projection = {
                    wallet: {
                        $elemMatch: {
                            symbol: data.symbol
                        }
                    },
                }
                Service.walletServices.fetchWalletDetails(criteria, projection, (err, Data) => {
                    if (err) {
                        if (err.code && err.code == 11000) {
                            return callback(err.message);
                        }
                        return callback(err);
                    } else {
                        return callback(null, Data);
                    }
                })
            }
        })
    }


    // } else {
    //     var i = 1;
    //     switch (data.symbol) {
    //         case "XRP":
    //             var symbol = "txrp"
    //             break;
    //         case "BTC":
    //             var symbol = "tbtc"
    //             break;
    //         case "BCH":
    //             var symbol = "tbch"
    //             break;
    //         case "LTC":
    //             var symbol = "tltc"
    //             break;
    //         case "ETH":
    //             var symbol = "teth"
    //             break;
    //     }
    //     if (symbol == "teth") {
    //         bitgo.coin(symbol).wallets()
    //             .generateWallet({
    //                 label: data.symbol + 'TestWalletnew' + i,
    //                 passphrase: 'secretpassphrase1a5df8380e0e30',
    //                 enterprise: '5afd2f477aaddfa807765a437b6470ba'
    //             })
    //             .then(function (wallet) {
    //                 var intoString = JSON.stringify(wallet);
    //                 Parse = JSON.parse(intoString)
    //                 walletId = Parse.wallet._wallet.id
    //                 console.log(Parse, "Parse========================================================")

    //                 bitgo.coin(symbol).wallets().get({
    //                     id: walletId,
    //                     allTokens: true,
    //                 }).then(function (wallet1) {
    //                     var intoString = JSON.stringify(wallet1);
    //                     Parse = JSON.parse(intoString)
    //                     console.log(Parse, "PARSE@+======================================================")
    //                     var Address = Parse._wallet.coinSpecific.baseAddress
    //                     var criteria = {
    //                         userId: data.userId,
    //                         wallet: {
    //                             $elemMatch: {
    //                                 symbol: data.symbol,

    //                             },
    //                         }
    //                     }
    //                     var projection = {
    //                         $set: {
    //                             "wallet.$.publicAddress": Address,
    //                             "wallet.$.walletId": walletId,
    //                         },
    //                     }
    //                     Service.walletServices.updateWalletDetails(criteria, projection, function (err, newData) {
    //                         console.log(err, newData);
    //                         if (err) {
    //                             if (err.code && err.code == 11000) {
    //                                 return callback(err.message);
    //                             }
    //                             return callback(err);
    //                         } else {
    //                             console.log(newData.n, "newData.n")
    //                             if (newData.n == '0') {
    //                                 return callback(null, newData);
    //                             }
    //                             var criteria = {
    //                                 userId: data.userId
    //                             }
    //                             var projection = {
    //                                 wallet: {
    //                                     $elemMatch: {
    //                                         symbol: data.symbol
    //                                     }
    //                                 },
    //                             }
    //                             Service.walletServices.fetchWalletDetails(criteria, projection, function (err, Data) {
    //                                 if (err) {
    //                                     if (err.code && err.code == 11000) {
    //                                         return callback(err.message);
    //                                     }
    //                                     return callback(err);
    //                                 } else {
    //                                     return callback(null, Data);

    //                                 }
    //                             })

    //                         }
    //                     })
    //                 }).catch((err) => {
    //                     return callback(err);
    //                 })
    //             }).catch((err) => {
    //                 return callback(err);
    //             })
    //     }
    //     bitgo.coin(symbol).wallets()
    //         .generateWallet({
    //             label: data.symbol + 'TestWalletnew' + i,
    //             passphrase: 'secretpassphrase1a5df8380e0e30'
    //         })
    //         .then(function (wallet) {
    //             var intoString = JSON.stringify(wallet);
    //             Parse = JSON.parse(intoString)
    //             walletId = Parse.wallet._wallet.id
    //             console.log(Parse)
    //             bitgo.coin(symbol).wallets().get({
    //                 id: walletId
    //             }).then(function (wallet1) {
    //                 var intoString = JSON.stringify(wallet1);
    //                 Parse = JSON.parse(intoString)
    //                 var Address = Parse._wallet.receiveAddress.address
    //                 var criteria = {
    //                     userId: data.userId,
    //                     wallet: {
    //                         $elemMatch: {
    //                             symbol: data.symbol,

    //                         },
    //                     }
    //                 }
    //                 var projection = {
    //                     $set: {
    //                         "wallet.$.publicAddress": Address,
    //                         "wallet.$.walletId": walletId,
    //                     },
    //                 }
    //                 Service.walletServices.updateWalletDetails(criteria, projection, function (err, newData) {
    //                     console.log(err, newData);
    //                     if (err) {
    //                         if (err.code && err.code == 11000) {
    //                             return callback(err.message);
    //                         }
    //                         return callback(err);
    //                     } else {
    //                         console.log(newData.n, "newData.n")
    //                         if (newData.n == '0') {
    //                             return callback(null, newData);
    //                         }
    //                         var criteria = {
    //                             userId: data.userId
    //                         }
    //                         var projection = {
    //                             wallet: {
    //                                 $elemMatch: {
    //                                     symbol: data.symbol
    //                                 }
    //                             },
    //                         }
    //                         Service.walletServices.fetchWalletDetails(criteria, projection, function (err, Data) {
    //                             if (err) {
    //                                 if (err.code && err.code == 11000) {
    //                                     return callback(err.message);
    //                                 }
    //                                 return callback(err);
    //                             } else {
    //                                 return callback(null, Data);

    //                             }
    //                         })

    //                     }
    //                 })
    //             })
    //         })
    // }
}
const InternalTransfers = (data, callback) => {
    data.fees = Number(data.fees);
    data.stopLoss = parseFloat(data.stopLoss);
    data.stopProfit = parseFloat(data.stopProfit);
    console.log(data.stopLoss, " data.stopLossRate================================================================");
    console.log(data.stopProfit, " data.stopProfitRate===============================================================");
    var criteria = {
        userId: data.userId
    };
    var projection = {
        wallet: {
            $elemMatch: {
                symbol: data.exchangeCurrencyFrom
            }
        },
        _id: 0,
        __v: 0,
        'wallet._id': 0
    }
    Service.walletServices.fetchWalletDetails(criteria, projection, (err, newData) => {
        console.log(err, newData);
        if (err) {
            if (err.code && err.code == 11000) {
                return err.message;
            }
            return err;
        } else {
            var uniqueId = Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16);
            var previousCoinBalance = newData[0].wallet[0].balance;
            if (previousCoinBalance >= data.requiredAmount) {
                var remainingBalance = previousCoinBalance - data.requiredAmount
                var criteria = {
                    symbol: data.exchangeCurrencyTo
                }
                cryptoController.fetchOneCryptoData(criteria, (err, Data) => {
                    if (err) {
                        return err;
                    } else {
                        console.log("============================DATA===============================", Data);
                        var minBalance = (data.fees * Data.buyingPriceUsd);
                        var balance = data.quantity - data.fees;
                        var sETHBalance = balance * Data.buyingPriceEth;
                        var sBTCBalance = balance * Data.buyingPriceBtc;
                        var sUSDBalance = balance * Data.buyingPriceUsd;
                        var sCCDBalance = balance * Data.buyingPriceCcd;
                        console.log(typeof sETHBalance, typeof sBTCBalance, typeof sUSDBalance, typeof balance)
                        // switch (data.exchangeCurrencyTo) {
                        //     case "ETH": 
                        //         var balance = data.quantity - data.fees;
                        //         var sETHBalance = balance * Data.buyingPriceEth;
                        //         var sBTCBalance = balance * Data.buyingPriceBtc;
                        //         var sUSDBalance = balance * Data.buyingPriceUsd;
                        //         var sCCDBalance = balance * Data.buyingPriceCcd;
                        //         console.log(typeof sETHBalance, typeof sBTCBalance, typeof sUSDBalance, typeof balance)
                        //         break;
                        //     case "XRP":
                        //         var balance = data.quantity - data.fees;
                        //         var sETHBalance = balance * Data.buyingPriceEth;
                        //         var sBTCBalance = balance * Data.buyingPriceBtc;
                        //         var sUSDBalance = balance * Data.buyingPriceUsd;
                        //         var sCCDBalance = balance * Data.buyingPriceCcd;
                        //         break;
                        //     case "BTC":
                        //         var balance = data.quantity - data.fees;
                        //         var sETHBalance = balance * Data.buyingPriceEth;
                        //         var sBTCBalance = balance * Data.buyingPriceBtc;
                        //         var sUSDBalance = balance * Data.buyingPriceUsd;
                        //         var sCCDBalance = balance * Data.buyingPriceCcd;
                        //         break;
                        //     case "LTC":
                        //         var balance = data.quantity - data.fees;
                        //         var sETHBalance = balance * Data.buyingPriceEth;
                        //         var sBTCBalance = balance * Data.buyingPriceBtc;
                        //         var sUSDBalance = balance * Data.buyingPriceUsd;
                        //         var sCCDBalance = balance * Data.buyingPriceCcd;
                        //         break;
                        //     case "BCH":
                        //         var balance = data.quantity - data.fees;
                        //         var sETHBalance = balance * Data.buyingPriceEth;
                        //         var sBTCBalance = balance * Data.buyingPriceBtc;
                        //         var sUSDBalance = balance * Data.buyingPriceUsd;
                        //         var sCCDBalance = balance * Data.buyingPriceCcd;
                        //         break;
                        //     case "CCD":
                        //         var balance = data.quantity - data.fees;
                        //         var sETHBalance = balance * Data.buyingPriceEth;
                        //         var sBTCBalance = balance * Data.buyingPriceBtc;
                        //         var sUSDBalance = balance * Data.buyingPriceUsd;
                        //         var sCCDBalance = balance * Data.buyingPriceCcd;
                        //         break;
                        // }
                        console.log(data.requiredAmount, "====================================================data.requiredAmount");
                        if (data.stopLoss != "0" || data.stopProfit != "0") {
                            var transactionCriteria = {
                                userId: data.userId,
                                symbol: data.exchangeCurrencyTo,
                                amount: data.quantity,
                                receiverUserId: data.userId,
                                recipientAddress: newData[0].wallet[0].publicAddress,
                                senderAddress: "",
                                buyFrom: data.exchangeCurrencyFrom,
                                type: data.transactionType,
                                dealType: data.type,
                                buySellRate: data.buySellRate,
                                stopLossRate: data.stopLoss,
                                stopProfitRate: data.stopProfit,
                                bitgoTransactionId: "INTERNAL TRANSFER",
                                bitgoTransaction: "INTERNAL TRANSFER",
                                bitgoTransactionStatus: "INTERNAL TRANSFER",
                                currencyType: "CRYPTO",
                                limitlevel: "",
                                limitRate: "",
                                limitStatus: "MARKET",
                                transactionStatus: "ACTIVE",
                                quantity: data.quantity,
                                fees: data.fees,
                                createdAt: new Date().toISOString(),
                                transactionId: uniqueId,
                                finalAmount: data.quantity,
                                recipientEmail:data.emailId,
                                paymentProviderId: "",
                                margin: "",
                                name: data.exchangeCurrencyTo,
                                profitOrLoss: "",
                                img: "",
                                contractTime: "",
                                contractEndTime: "",
                                buyFromQuantity: data.requiredAmount,
                            };
                            var receiveWalletCriteria = {
                                type: "MARKETRECEIVER",
                                userId: data.userId,
                                symbol: data.exchangeCurrencyTo,
                                balance: balance,
                                sETHBalance: sETHBalance,
                                sBTCBalance: sBTCBalance,
                                sUSDBalance: sUSDBalance,
                                sINRBalance: sCCDBalance,
                                fees: minBalance,
                            };
                        } else if (data.stopLoss == "0" || data.stopProfit == "0") {
                            var transactionCriteria = {
                                userId: data.userId,
                                symbol: data.exchangeCurrencyTo,
                                amount: data.quantity,
                                receiverUserId: data.userId,
                                recipientAddress: newData[0].wallet[0].publicAddress,
                                senderAddress: "",
                                buyFrom: data.exchangeCurrencyFrom,
                                type: data.transactionType,
                                dealType: data.type,
                                buySellRate: data.buySellRate,
                                stopLossRate: data.stopLoss,
                                stopProfitRate: data.stopProfit,
                                bitgoTransactionId: "INTERNAL TRANSFER",
                                bitgoTransaction: "INTERNAL TRANSFER",
                                bitgoTransactionStatus: "INTERNAL TRANSFER",
                                currencyType: "CRYPTO",
                                limitlevel: "",
                                limitRate: "",
                                limitStatus: "MARKET",
                                transactionStatus: "CLOSED",
                                quantity: data.quantity,
                                fees: data.fees,
                                createdAt: new Date().toISOString(),
                                transactionId: uniqueId,
                                finalAmount: data.quantity,
                                recipientEmail: data.emailId,
                                paymentProviderId: "",
                                margin: "",
                                name: data.exchangeCurrencyTo,
                                profitOrLoss: "",
                                img: "",
                                contractTime: "",
                                contractEndTime: "",
                                buyFromQuantity: data.requiredAmount,
                            };
                            var receiveWalletCriteria = {
                                type: "DEALRECEIVER",
                                userId: data.userId,
                                symbol: data.exchangeCurrencyTo,
                                balance: balance,
                                sETHBalance: sETHBalance,
                                sBTCBalance: sBTCBalance,
                                sUSDBalance: sUSDBalance,
                                sINRBalance: sCCDBalance,
                                fees: minBalance,
                            };
                        }
                        var senderWalletCriteria = {
                            type: "SENDER",
                            userId: data.userId,
                            symbol: data.exchangeCurrencyFrom,
                            balance: remainingBalance,
                        };
                        console.log(transactionCriteria, "CRITERIA");
                        console.log(typeof sETHBalance, typeof sBTCBalance, typeof sUSDBalance, typeof balance, typeof data.fees)
                        Controller.createTransaction(transactionCriteria, (err, NewData) => {
                            if (err) {
                                return err.message;
                            } else {
                                console.log(NewData, "TRANSACTION CREATED SUCCESSFULLY");
                                updateWalletInternalTransfer(receiveWalletCriteria, (err, updatedData) => {
                                    if (err) {
                                        return err.message;
                                    } else {
                                        console.log(updatedData, "RECEIVED WALLET UPDATED");
                                        updateWalletInternalTransfer(senderWalletCriteria, (err, UpdatedData) => {
                                            if (err) {
                                                return err.message;
                                            } else {
                                                console.log(UpdatedData, "SENDER WALLET UPDATED");
                                                return callback(null, NewData);
                                            }
                                        })
                                    }

                                })

                            }
                        })

                    }
                })
            } else {
                console.log("***************************************INSUFFICIENT FUNDS**********************************************");
                return callback({
                    "MESSAGE": "INSUFFICIENT FUNDS"
                });
            }
        }
    })
}
// 
const fetchFourWalletDetails = (data, callback) => {
    var criteria = {
        userId: data.userId,
    }
    Service.walletServices.fetchWalletDetails(criteria, {}, (err, newData) => {
        console.log(err, newData);
        if (err) {
            if (err.code && err.code == 11000) {
                return callback(err.message);
            }
            return callback(err);
        } else {
            console.log(newData[0].wallet.length, "symbol");
            var arrayForFour = [];
            for (var i = 0; i < newData[0].wallet.length; i++) {
                if (newData[0].wallet[i].symbol == "BTC") {
                    console.log(newData[0].wallet[i], "symbol");
                    arrayForFour.push({
                        BTCbalanceinUSD: newData[0].wallet[i].sUSDBalance
                    });
                    arrayForFour.push({
                        BTCbalance: newData[0].wallet[i].balance
                    });
                }
                if (newData[0].wallet[i].symbol == "USDT") {
                    console.log(newData[0].wallet[i], "symbol");
                    arrayForFour.push({
                        USDTbalance: newData[0].wallet[i].balance
                    });
                    arrayForFour.push({
                        USDTbalanceinBTC: newData[0].wallet[i].sBTCBalance
                    });
                }
                if (newData[0].wallet[i].symbol == "ETH") {
                    console.log(newData[0].wallet[i], "symbol");
                    arrayForFour.push({
                        ETHbalanceinUSD: newData[0].wallet[i].sUSDBalance
                    });
                    arrayForFour.push({
                        ETHbalance: newData[0].wallet[i].balance
                    });
                    arrayForFour.push({
                        ETHbalanceinBTC: newData[0].wallet[i].sBTCBalance
                    });
                }
                if (newData[0].wallet[i].symbol == "CCD") {
                    console.log(newData[0].wallet[i], "symbol");
                    arrayForFour.push({
                        CCDbalanceinUSD: newData[0].wallet[i].sUSDBalance
                    });
                    arrayForFour.push({
                        CCDbalance: newData[0].wallet[i].balance
                    });
                    arrayForFour.push({
                        CCDbalanceinBTC: newData[0].wallet[i].sBTCBalance
                    });
                }
            }
            console.log(arrayForFour, `arrayForFour`);
            return callback(null, arrayForFour);
        }
    })
}
const fetchZeroBalance = (data, callback) => {
    var nwArray = [];
    var criteria = {
        userId: data.userId,
    }
    Service.walletServices.fetchWalletDetails(criteria, {}, (err, newData) => {
        if (err) {
            if (err.code && err.code == 11000) {
                return callback(err.message);
            }
            return callback(err);
        } else {
            if (newData.length == 0) {
                return callback({
                    "Message": "No user with this userId found"
                });
            } else {
                console.log(newData, "NEWDATATATATATTAATTATATATTATATATATATATA");
                for (var i = 0; i < newData[0].wallet.length; i++) {
                    // console.log(`inside loop`);
                    if (newData[0].wallet[i].balance > 0) {
                        nwArray.push(newData[0].wallet[i]);
                    }
                }
                console.log(nwArray.length, nwArray, "LENGTH AND ARRAY ITSELF");
            }
            if (nwArray.length == 0) {
                return callback({
                    "Message": "Oops !!!! All Wallets are Empty"
                });
            } else {
                return callback(null, nwArray);
            }
        }
    })
}
module.exports = {
    // saveWalletDetails: saveWalletDetails,
    updateWalletDetails: updateWalletDetails,
    fetchWalletDetails: fetchWalletDetails,
    createWalletAddress: createWalletAddress,
    sendCoins: sendCoins,
    fetchWalletDetailsINR: fetchWalletDetailsINR,
    // internalTransfers: internalTransfers,
    fetchZeroBalance: fetchZeroBalance,
    fetchFourWalletDetails: fetchFourWalletDetails,
    updateWalletDetails: updateWalletDetails,
    updateWalletInternalTransfer: updateWalletInternalTransfer,
    SaveWalletDetails: SaveWalletDetails,
    InternalTransfers: InternalTransfers,
}
// const saveWalletDetails = function (data, callback) {
//     var criteria = {
//         userId: data.userId
//     };
//     Service.walletServices.fetchWalletDetails(criteria, function (err, newData) {
//         if (err) {
//             return err.message
//         } else {
//             console.log(newData, "newdata=====================================================================================")
//             console.log(newData.length, "LENGTH==============================");

//             if (newData.length == 0) {
//                 Service.coinMarketServices.fetchDetails(function (err, Data) {
//                     if (err) {
//                         return err.message;
//                     } else {
//                         coinMarketData = Data;
//                     }
//                     console.log("coinmarket", coinMarketData, "============================")
//                     if (coinMarketData.length != 0) {
//                         var createData = [];
//                         var criteria = {
//                             name: "INR",
//                             symbol: "INR",
//                             paymentProviderId: "",
//                             sCryptoImage: path + "/INR.png",
//                             sINRBalance: 0,
//                             sETHBalance: 0,
//                             sBTCBalance: 0,
//                             sUSDBalance: 0,
//                             sMargin: "0.00",
//                             sProfitLoss: "0.00",
//                             privateAddress: "",
//                             publicAddress: "",
//                             walletId: "",
//                             minBalance: 0,
//                             balance: 0,
//                             onOrdersBalance: 0,
//                             sType: "NONCRYPTO",
//                         }
//                         createData.push(criteria);
//                         criteria = {
//                             name: "USD",
//                             symbol: "USD",
//                             paymentProviderId: "",
//                             sCryptoImage: path + "/usd.png",
//                             sINRBalance: 0,
//                             sETHBalance: 0,
//                             sBTCBalance: 0,
//                             sUSDBalance: 0,
//                             sMargin: 0,
//                             privateAddress: "",
//                             publicAddress: "",
//                             sProfitLoss: "0.00",
//                             walletId: "",
//                             minBalance: 0,
//                             balance: 0,
//                             onOrdersBalance: 0,
//                             sType: "NONCRYPTO",
//                         }
//                         createData.push(criteria);
//                         criteria = {
//                             name: "USDT",
//                             symbol: "USDT",
//                             paymentProviderId: "",
//                             sCryptoImage: path + "/usdt.png",
//                             sINRBalance: 0,
//                             sETHBalance: 0,
//                             sBTCBalance: 0,
//                             sUSDBalance: 0,
//                             sMargin: 0,
//                             privateAddress: "",
//                             publicAddress: "",
//                             walletId: "",
//                             sProfitLoss: 0,
//                             minBalance: 0,
//                             balance: 0,
//                             onOrdersBalance: 0,
//                             sType: "NONCRYPTO",
//                         }
//                         createData.push(criteria);

//                         console.log("inside======", coinMarketData.length)
//                         for (var i = 0; i < coinMarketData.length; i++) {
//                             criteria = {
//                                 name: coinMarketData[i].name,
//                                 symbol: coinMarketData[i].symbol,
//                                 sCryptoImage: coinMarketData[i].img,
//                                 sINRBalance: 0,
//                                 sETHBalance: 0,
//                                 sBTCBalance: 0,
//                                 sUSDBalance: 0,
//                                 sMargin: 0,
//                                 sProfitLoss: "0.00",
//                                 paymentProviderId: "",
//                                 privateAddress: "",
//                                 publicAddress: "",
//                                 walletId: "",
//                                 minBalance: 0,
//                                 balance: 0,
//                                 onOrdersBalance: 0,
//                                 sType: "CRYPTO",
//                             };
//                             createData.push(criteria);
//                         }
//                         console.log(createData.length, "====================================length")
//                         if (createData.length >= coinMarketData.length) {
//                             var criteria = {
//                                 userId: data.userId,
//                                 wallet: createData

//                             };
//                             Service.walletServices.saveWalletDetails(criteria, function (err, nData) {
//                                 console.log(err, nData);
//                                 if (err) {
//                                     if (err.code && err.code == 11000) {
//                                         return callback(err.message);
//                                     }
//                                     return callback(err);
//                                 } else {
//                                     return callback(null, nData);
//                                 }
//                             })
//                         }

//                     }
//                 })
//             } else {
//                 console.log("outsidE 0");
//                 return callback(null, newData)
//             }

//         }

//     })

// }

//***************************************************************************************************************************** */
//const internalTransfers = function (data, callback) {
//     data.stopLoss = parseFloat(data.stopLoss);
//     data.stopProfit = parseFloat(data.stopProfit);
//     console.log(data.stopLoss, " data.stopLossRate================================================================");
//     console.log(data.stopProfit, " data.stopProfitRate===============================================================");
//     var criteria = {
//         userId: data.userId
//     };
//     var projection = {
//         wallet: {
//             $elemMatch: {
//                 symbol: data.exchangeCurrencyFrom
//             }
//         },
//         _id: 0,
//         __v: 0,
//         'wallet._id': 0
//     }
//     Service.walletServices.fetchWalletDetails(criteria, projection, function (err, newData) {
//         console.log(err, newData);
//         if (err) {
//             if (err.code && err.code == 11000) {
//                 return err.message;
//             }
//             return err;
//         } else {
//             var uniqueId = Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16);
//             var previousCoinBalance = newData[0].wallet[0].balance;
//             if (previousCoinBalance >= data.requiredAmount) {
//                 var remainingBalance = previousCoinBalance - data.requiredAmount
//                 var criteria = {
//                     symbol: data.exchangeCurrencyTo
//                 }
//                 coinController.fetchOneCurrency(criteria, function (err, Data) {
//                     if (err) {
//                         return err;
//                     } else {
//                         var minBalance = (data.fees * Data.price_usd);
//                         switch (data.exchangeCurrencyTo) {
//                             case "ETH":
//                                 var balance = data.quantity - data.fees;
//                                 var sETHBalance = balance * Data.price_eth;
//                                 var sBTCBalance = balance * Data.price_btc;
//                                 var sUSDBalance = balance * Data.price_usd;
//                                 var sINRBalance = balance * Data.price_inr;
//                                 break;
//                             case "XRP":
//                                 var balance = data.quantity - data.fees;
//                                 var sETHBalance = balance * Data.price_eth;
//                                 var sBTCBalance = balance * Data.price_btc;
//                                 var sUSDBalance = balance * Data.price_usd;
//                                 var sINRBalance = balance * Data.price_inr;
//                                 break;
//                             case "BTC":
//                                 var balance = data.quantity - data.fees;
//                                 var sETHBalance = balance * Data.price_eth;
//                                 var sBTCBalance = balance * Data.price_btc;
//                                 var sUSDBalance = balance * Data.price_usd;
//                                 var sINRBalance = balance * Data.price_inr;
//                                 break;
//                             case "LTC":
//                                 var balance = data.quantity - data.fees;
//                                 var sETHBalance = balance * Data.price_eth;
//                                 var sBTCBalance = balance * Data.price_btc;
//                                 var sUSDBalance = balance * Data.price_usd;
//                                 var sINRBalance = balance * Data.price_inr;
//                                 break;
//                             case "BCH":
//                                 var balance = data.quantity - data.fees;
//                                 var sETHBalance = balance * Data.price_eth;
//                                 var sBTCBalance = balance * Data.price_btc;
//                                 var sUSDBalance = balance * Data.price_usd;
//                                 var sINRBalance = balance * Data.price_inr;
//                                 break;
//                         }
//                         console.log(data.requiredAmount, "====================================================data.requiredAmount");
//                         if (data.stopLoss != "0" || data.stopProfit != "0") {
//                             var transactionCriteria = {
//                                 userId: data.userId,
//                                 symbol: data.exchangeCurrencyTo,
//                                 amount: data.quantity,
//                                 receiverUserId: data.userId,
//                                 recipientAddress: newData[0].wallet[0].publicAddress,
//                                 senderAddress: "",
//                                 buyFrom: data.exchangeCurrencyFrom,
//                                 type: data.transactionType,
//                                 dealType: data.type,
//                                 buySellRate: data.buySellRate,
//                                 stopLossRate: data.stopLoss,
//                                 stopProfitRate: data.stopProfit,
//                                 bitgoTransactionId: "INTERNAL TRANSFER",
//                                 bitgoTransaction: "INTERNAL TRANSFER",
//                                 bitgoTransactionStatus: "INTERNAL TRANSFER",
//                                 currencyType: "CRYPTO",
//                                 limitlevel: "",
//                                 limitRate: "",
//                                 limitStatus: "MARKET",
//                                 transactionStatus: "ACTIVE",
//                                 quantity: data.quantity,
//                                 fees: data.fees,
//                                 createdAt: new Date().toISOString(),
//                                 transactionId: uniqueId,
//                                 finalAmount: data.quantity,
//                                 recipientEmail: "",
//                                 paymentProviderId: "",
//                                 margin: "",
//                                 name: data.exchangeCurrencyTo,
//                                 profitOrLoss: "",
//                                 img: "",
//                                 contractTime: "",
//                                 contractEndTime: "",
//                                 buyFromQuantity: data.requiredAmount,
//                             };
//                             var receiveWalletCriteria = {
//                                 type: "MARKETRECEIVER",
//                                 userId: data.userId,
//                                 symbol: data.exchangeCurrencyTo,
//                                 balance: balance,
//                                 sETHBalance: sETHBalance,
//                                 sBTCBalance: sBTCBalance,
//                                 sUSDBalance: sUSDBalance,
//                                 sINRBalance: sINRBalance,
//                                 fees: minBalance,
//                             };
//                         } else if (data.stopLoss == "0" || data.stopProfit == "0") {
//                             var transactionCriteria = {
//                                 userId: data.userId,
//                                 symbol: data.exchangeCurrencyTo,
//                                 amount: data.quantity,
//                                 receiverUserId: data.userId,
//                                 recipientAddress: newData[0].wallet[0].publicAddress,
//                                 senderAddress: "",
//                                 buyFrom: data.exchangeCurrencyFrom,
//                                 type: data.transactionType,
//                                 dealType: data.type,
//                                 buySellRate: data.buySellRate,
//                                 stopLossRate: data.stopLoss,
//                                 stopProfitRate: data.stopProfit,
//                                 bitgoTransactionId: "INTERNAL TRANSFER",
//                                 bitgoTransaction: "INTERNAL TRANSFER",
//                                 bitgoTransactionStatus: "INTERNAL TRANSFER",
//                                 currencyType: "CRYPTO",
//                                 limitlevel: "",
//                                 limitRate: "",
//                                 limitStatus: "MARKET",
//                                 transactionStatus: "CLOSED",
//                                 quantity: data.quantity,
//                                 fees: data.fees,
//                                 createdAt: new Date().toISOString(),
//                                 transactionId: uniqueId,
//                                 finalAmount: data.quantity,
//                                 recipientEmail: "",
//                                 paymentProviderId: "",
//                                 margin: "",
//                                 name: data.exchangeCurrencyTo,
//                                 profitOrLoss: "",
//                                 img: "",
//                                 contractTime: "",
//                                 contractEndTime: "",
//                                 buyFromQuantity: data.requiredAmount,
//                             };
//                             var receiveWalletCriteria = {
//                                 type: "DEALRECEIVER",
//                                 userId: data.userId,
//                                 symbol: data.exchangeCurrencyTo,
//                                 balance: balance,
//                                 sETHBalance: sETHBalance,
//                                 sBTCBalance: sBTCBalance,
//                                 sUSDBalance: sUSDBalance,
//                                 sINRBalance: sINRBalance,
//                                 fees: minBalance,
//                             };
//                         }
//                         var senderWalletCriteria = {
//                             type: "SENDER",
//                             userId: data.userId,
//                             symbol: data.exchangeCurrencyFrom,
//                             balance: remainingBalance,
//                         };
//                         console.log(transactionCriteria, "CRITERIA");
//                         Controller.createTransaction(transactionCriteria, function (err, NewData) {
//                             if (err) {
//                                 return err.message;
//                             } else {
//                                 console.log(NewData, "TRANSACTION CREATED SUCCESSFULLY");
//                                 updateWalletInternalTransfer(receiveWalletCriteria, function (err, updatedData) {
//                                     if (err) {
//                                         return err.message;
//                                     } else {
//                                         console.log(updatedData, "RECEIVED WALLET UPDATED");
//                                         updateWalletInternalTransfer(senderWalletCriteria, function (err, UpdatedData) {
//                                             if (err) {
//                                                 return err.message;
//                                             } else {
//                                                 console.log(UpdatedData, "SENDER WALLET UPDATED");
//                                                 return callback(null, NewData);
//                                             }
//                                         })
//                                     }

//                                 })

//                             }
//                         })

//                     }
//                 })
//             } else {
//                 console.log("INSUFFICIENT FUNDS");
//                 return callback(null, {
//                     "MESSAGE": "INSUFFICIENT FUNDS"
//                 });
//             }
//         }
//     })
// }