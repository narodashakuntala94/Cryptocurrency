var Controller = require('../controllers');
const Joi = require('joi');
const request = require('request');
const Config = require('../config');
var service = require('../services/coindetailservices')
var ETHfactor;
var recievedAdminData, walletDetailsTo;
var recievedDetails;
var path = "http://" + Config.ServerPath;
var urljoin = require('urljoin');
var percent_change_24h;
var percent_change_7d;
var percent_change_1h;
var length, OpenedAt;
var min, max, min_inr, max_inr;
const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
var startOfDay = Math.floor(Date.now() / interval) * interval;
var endOfDay = startOfDay + interval - 1; // 23:59:59:9999
var Service = require('../services');
var adminData, responseArray;
var newArray, CryptoData;
var ethFactorBuy, ethFactorSell, btcFactorBuy, btcFactorSell, ccdFactorBuy, ccdFactorSell;
//////Closure for new rates, calculating eth,btc and ccd fators  and adding images to the array//////////////////
var closureForAdmin = (i) => {
    const adminFunction = (j) => {
        if (adminData[j].symbol == responseArray[i].symbol) {
            console.log(adminData[j].sellRate, "ADMINSELLRATE");
            console.log(adminData[j].symbol);
            if (adminData[j].sellRate > 0) {
                var sellingPrice = responseArray[i].quotes.USD.price + (responseArray[i].quotes.USD.price * adminData[j].sellRate / 100);
            } else {
                var sellingPrice = responseArray[i].quotes.USD.price
            }
            if (adminData[j].buyRate > 0) {
                var buyingPrice = responseArray[i].quotes.USD.price + (responseArray[i].quotes.USD.price * adminData[j].buyRate / 100);
            } else {
                var buyingPrice = responseArray[i].quotes.USD.price;
            }
            if (responseArray[i].symbol == "ETH") {
                ethFactorBuy = 1 / buyingPrice;
                ethFactorSell = 1 / sellingPrice;
            }
            if (responseArray[i].symbol == "BTC") {
                btcFactorBuy = 1 / buyingPrice;
                btcFactorSell = 1 / sellingPrice
            }
            if (responseArray[i].symbol == "CCD") {
                ccdFactorBuy = 1 / buyingPrice;
                ccdFactorSell = 1 / sellingPrice
            }
            switch (responseArray[i].name) {
                case "Bitcoin":
                    var imageLink = path + "/bitcoin.png"
                    // newArray.push(img = path + "/bitcoin.png");
                    break;
                case "Ethereum":
                    var imageLink = path + "/ethereum.png";
                    break;
                case "XRP":
                    var imageLink = path + "/ripple.png";
                    break;
                case "Bitcoin Cash":
                    var imageLink = path + "/bitcoincash.png";
                    break;
                case "EOS":
                    var imageLink = path + "/eos.png";
                    break;
                case "Litecoin":
                    var imageLink = path + "/litecoin.png";
                    break;
                case "ZenCash":
                    var imageLink = path + "/zcash.png";
                    break;
                case "Decentraland":
                    var imageLink = path + "/Decentraland.png";
                    break;
                case "Tezos":
                    var imageLink = path + "/tezos.png";
                    break;
                case "Holo":
                    var imageLink = path + "/holo.png";
                    break;
                case "Paypex":
                    var imageLink = path + "/Paypex.png";
                    break;
                case "Bibox Token":
                    var imageLink = path + "/BiboxToken.png";
                    break;
                case "Dropil":
                    var imageLink = path + "/Dropil.png";
                    break;
                case "Coincode":
                    var imageLink = path + "/Coincode.png";
                    break;
                case "TenX":
                    var imageLink = path + "/tenx.png";
                    break;
                case "Polymath":
                    var imageLink = path + "/Polymath.png";
                    break;
                case "Emercoin":
                    var imageLink = path + "/emercoin.png";
                    break;
                case "Cardano":
                    var imageLink = path + "/cardano.png";
                    break;
                case "Stellar":
                    var imageLink = path + "/stellar.png";
                    break;
                case "IOTA":
                    var imageLink = path + "/iota.png";
                    break;
                case "NEO":
                    var imageLink = path + "/neo.png";
                    break;
                case "TRON":
                    var imageLink = path + "/tron.png";
                    break;
                case "Monero":
                    var imageLink = path + "/monero.png";
                    break;
                case "Dash":
                    var imageLink = path + "/dash.png";
                    break;
                case "NEM":
                    var imageLink = path + "/nem.png";
                    break;
                case "Tether":
                    var imageLink = path + "/tether.png";
                    break;
                case "OmiseGO":
                    var imageLink = path + "/OmiseGO.png";
                    break;
                case "VeChain":
                    var imageLink = path + "/VeChain.png";
                    break;
                case "Ethereum Classic":
                    var imageLink = path + "/ethereumClassic.png";
                    break;
                case "Qtum":
                    var imageLink = path + "/qtum.png";
                    break;
                case "Binance Coin":
                    var imageLink = path + "/binanceCoin.png";
                    break;
                case "ICON":
                    var imageLink = path + "/icon.png";
                    break;
                case "Bitcoin Gold":
                    var imageLink = path + "/bitcoin_gold.png";
                    break;
                case "Lisk":
                    var imageLink = path + "/lisk.png";
                    break;
                case "Zcash":
                    var imageLink = path + "/zcash.png";
                    break;
                case "Verge":
                    var imageLink = path + "/Verge.png";
                    break;
                case "Steem":
                    var imageLink = path + "/steem.png";
                    break;
                case "Bytom":
                    var imageLink = path + "/Bytom.png";
                    break;
                case "Bitcoin Private":
                    var imageLink = path + "/BitcoinPrivate.png";
                    break;
                case "Nano":
                    var imageLink = path + "/nano.png";
                    break;
                case "Bytecoin":
                    var imageLink = path + "/bytcoin.png";
                    break;
                case "Populous":
                    var imageLink = path + "/Populous.png";
                    break;
                case "Wanchain":
                    var imageLink = path + "/Wanchain.png";
                    break;
                case "Siacoin":
                    var imageLink = path + "/siacoin.png";
                    break;
                case "BitShares":
                    var imageLink = path + "/BitShares.png";
                    break;
                case "Bitcoin Diamond":
                    var imageLink = path + "/bitcoin_diamond.png";
                    break;
                case "Zilliqa":
                    var imageLink = path + "/Zilliqa.png";
                    break;
                case "Ontology":
                    var imageLink = path + "/ontology.png";
                    break;
                case "Aeternity":
                    var imageLink = path + "/Aeternity.png";
                    break;
                case "Maker":
                    var imageLink = path + "/maker.png";
                    break;
                case "Dogecoin":
                    var imageLink = path + "/dogecoin.png";
                    break;
                case "Decred":
                    var imageLink = path + "/Decred.png";
                    break;
                case "Stratis":
                    var imageLink = path + "/Stratis.png";
                    break;
                case "0x":
                    var imageLink = path + "/0x.png";
                    break;
                case "Mixin":
                    var imageLink = path + "/Mixin.png";
                    break;
                case "DigixDAO":
                    var imageLink = path + "/DigixDAO.png";
                    break;
                case "Waves":
                    var imageLink = path + "/waves.png";
                    break;
                case "RChain":
                    var imageLink = path + "/RChain.png";
                    break;
                case "Status":
                    var imageLink = path + "/Status.png";
                    break;
                case "Aion":
                    var imageLink = path + "/Aion.png";
                    break;
                case "Golem":
                    var imageLink = path + "/Golem.png";
                    break;
                case "Augur":
                    var imageLink = path + "/Augur.png";
                    break;
                case "Loopring":
                    var imageLink = path + "/Loopring.png";
                    break;
                case "Basic Attention Token":
                    var imageLink = path + "/BasicAttentionToken.png";
                    break;
                case "Kyber Network":
                    var imageLink = path + "/kyber_network.png";
                    break;
                case "Hshare":
                    var imageLink = path + "/Hshare.png";
                    break;
                case "Waltonchain":
                    var imageLink = path + "/Waltonchain.png";
                    break;
                case "IOST":
                    var imageLink = path + "/io_stoken.png";
                    break;
                case "Komodo":
                    var imageLink = path + "/komodo.png";
                    break;
                case "Ardor":
                    var imageLink = path + "/Ardor.png";
                    break;
                case "DigiByte":
                    var imageLink = path + "/digibyte.png";
                    break;
                case "KuCoin Shares":
                    var imageLink = path + "/KuCoinShares.png";
                    break;
                case "Ark":
                    var imageLink = path + "/Ark.png";
                    break;
                case "Centrality":
                    var imageLink = path + "/Centrality.png";
                    break;
                case "PIVX":
                    var imageLink = path + "/pivx.png";
                    break;
                case "Syscoin":
                    var imageLink = path + "/syscoin.png";
                    break;
                case "Mithril":
                    var imageLink = path + "/mithiril.png";
                    break;
                case "Substratum":
                    var imageLink = path + "/substratum.png";
                    break;
                case "aelf":
                    var imageLink = path + "/aelf.png";
                    break;
                case "MonaCoin":
                    var imageLink = path + "/MonaCoin.png";
                    break;
                case "Cryptonex":
                    var imageLink = path + "/Cryptonex.png";
                    break;
                case "Dragonchain":
                    var imageLink = path + "/Dragonchain.png";
                    break;
                case "Storm":
                    var imageLink = path + "/strom.png";
                    break;
                case "Gas":
                    var imageLink = path + "/Gas.png";
                    break;
                case "QASH":
                    var imageLink = path + "/QASH.png";
                    break;
                case "Dentacoin":
                    var imageLink = path + "/dentacoin.png";
                    break;
                case "Ethos":
                    var imageLink = path + "/ethos.png";
                    break;
                case "Factom":
                    var imageLink = path + "/Factom.png";
                    break;
                case "Pundi X":
                    var imageLink = path + "/pundi.png";
                    break;
                case "Nebulas":
                    var imageLink = path + "/Nebulas.png";
                    break;
                case "Cortex":
                    var imageLink = path + "/Cortex.png";
                    break;
                case "Veritaseum":
                    var imageLink = path + "/Veritaseum.png";
                    break;
                case "Bancor":
                    var imageLink = path + "/bancor.png";
                    break;
                case "ReddCoin":
                    var imageLink = path + "/reddcoin.png";
                    break;
                case "FunFair":
                    var imageLink = path + "/FunFair.png";
                    break;
                case "GXChain":
                    var imageLink = path + "/gxchain.png";
                    break;
                case "Elastos":
                    var imageLink = path + "/elastos.png";
                    break;
                case "SALT":
                    var imageLink = path + "/salt.png";
                    break;
                case "ZCoin":
                    var imageLink = path + "/zcoin.png";
                    break;
                case "Nxt":
                    var imageLink = path + "/nxt.png";
                    break;
                case "WAX":
                    var imageLink = path + "/WAX.png";
                    break;
                case "Kin":
                    var imageLink = path + "/kin.png";
                    break;
                case "Power Ledger":
                    var imageLink = path + "/power_ledger.png";
                    break;
                case "Crypto.com":
                    var imageLink = path + "/Monaco.png";
                    break;
                case "Metaverse ETP":
                    var imageLink = path + "/MetaverseETP.png";
                    break;
                case "Chainlink":
                    var imageLink = path + "/chain_link.png";
                    break;
                case "TrueUSD":
                    var imageLink = path + "/TrueUSD.png";
                    break;
                case "ETERNAL TOKEN":
                    var imageLink = path + "/ETERNALTOKEN.png";
                    break;
                case "HyperCash":
                    var imageLink = path + "/Hypercash.png";
                    break;
                case "Horizen":
                    var imageLink = path + "/horizen.png";
                    break;
                case "Aurora":
                    var imageLink = path + "/Aurora.png";
                    break;
                case "Dai":
                    var imageLink = path + "/Dai.png";
                    break;
                case "Revain":
                    var imageLink = path + "/Revain.png";
                    break;
                case "Enigma":
                    var imageLink = path + "/enigma.png";
                    break;
                case "Electroneum":
                    var imageLink = path + "/Electroneum.png";
                    break;
                case "Byteball Bytes":
                    var imageLink = path + "/byteball_bytes.png";
                    break;
                case "Nucleus Vision":
                    var imageLink = path + "/nucleus_vision.png";
                    break;
                case "MaidSafeCoin":
                    var imageLink = path + "/maid_safe.png";
                    break;
                case "ChainLink":
                    var imageLink = path + "/chain_link.png";
                    break;
                case "Gifto":
                    var imageLink = path + "/Gifto.png";
                    break;
                case "CyberMiles":
                    var imageLink = path + "/CyberMiles.png";
                    break;
                case "Fusion":
                    var imageLink = path + "/Fusion.png";
                    break;
                case "Huobi Token":
                    var imageLink = path + "/huobiToken.png";
                    break;
                case "Loom Network":
                    var imageLink = path + "/loomNetwork.png";
                    break;
                case "MOAC":
                    var imageLink = path + "/moac.png";
                    break;
                case "Skycoin":
                    var imageLink = path + "/skycoin.png";
                    break;
                case "Theta Token":
                    var imageLink = path + "/ThetaToken.png";
                    break;
                case "Nuls":
                    var imageLink = path + "/nuls.png";
                    break;
                default:
                    var imageLink = path + "/default_coin.png";
            }
            newArray.push({
                name: responseArray[i].name,
                symbol: responseArray[i].symbol,
                buyingPriceUsd: Number((buyingPrice)),
                sellingPriceUsd: Number((sellingPrice)),
                percentChange24h: responseArray[i].quotes.USD.percent_change_24h,
                img: imageLink,
                createdAt: new Date().toISOString(),
                updatedAt: responseArray[i].last_updated,
                rank: responseArray[i].rank
            });
        }
        return newArray;
    }
    return adminFunction;
}
var closureForUpdateData = (i) => {
    const updateFunction = (j) => {
        if (adminData[j].symbol == responseArray[i].symbol) {
            console.log(adminData[j].sellRate, "ADMINSELLRATE");
            console.log(adminData[j].symbol);
            if (adminData[j].sellRate > 0) {
                var sellingPrice = responseArray[i].quotes.USD.price + (responseArray[i].quotes.USD.price * adminData[j].sellRate / 100);
            } else {
                var sellingPrice = responseArray[i].quotes.USD.price
            }
            if (adminData[j].buyRate > 0) {
                var buyingPrice = responseArray[i].quotes.USD.price + (responseArray[i].quotes.USD.price * adminData[j].buyRate / 100);
            } else {
                var buyingPrice = responseArray[i].quotes.USD.price;
            }
            if (responseArray[i].symbol == "ETH") {
                ethFactorBuy = 1 / buyingPrice;
                ethFactorSell = 1 / sellingPrice;
            }
            if (responseArray[i].symbol == "BTC") {
                btcFactorBuy = 1 / buyingPrice;
                btcFactorSell = 1 / sellingPrice
            }
            if (responseArray[i].symbol == "CCD") {
                ccdFactorBuy = 1 / buyingPrice;
                ccdFactorSell = 1 / sellingPrice
            }
            switch (responseArray[i].name) {
                case "Crypto.com":
                    var imageLink = path + "/Monaco.png";
                    break;
                case "Metaverse ETP":
                    var imageLink = path + "/MetaverseETP.png";
                    break;
                case "Chainlink":
                    var imageLink = path + "/chain_link.png";
                    break;
                case "TrueUSD":
                    var imageLink = path + "/TrueUSD.png";
                    break;
                case "ETERNAL TOKEN":
                    var imageLink = path + "/ETERNALTOKEN.png";
                    break;
                case "HyperCash":
                    var imageLink = path + "/Hypercash.png";
                    break;
                case "Horizen":
                    var imageLink = path + "/horizen.png";
                    break;
                case "Aurora":
                    var imageLink = path + "/Aurora.png";
                    break;
                case "Dai":
                    var imageLink = path + "/Dai.png";
                    break;
                case "Bitcoin":
                    var imageLink = path + "/bitcoin.png"
                    // newArray.push(img = path + "/bitcoin.png");
                    break;
                case "Ethereum":
                    var imageLink = path + "/ethereum.png";
                    break;
                case "XRP":
                    var imageLink = path + "/ripple.png";
                    break;
                case "Bitcoin Cash":
                    var imageLink = path + "/bitcoincash.png";
                    break;
                case "EOS":
                    var imageLink = path + "/eos.png";
                    break;
                case "Litecoin":
                    var imageLink = path + "/litecoin.png";
                    break;
                case "ZenCash":
                    var imageLink = path + "/zcash.png";
                    break;
                case "Decentraland":
                    var imageLink = path + "/Decentraland.png";
                    break;
                case "Tezos":
                    var imageLink = path + "/tezos.png";
                    break;
                case "Holo":
                    var imageLink = path + "/holo.png";
                    break;
                case "Paypex":
                    var imageLink = path + "/Paypex.png";
                    break;
                case "Bibox Token":
                    var imageLink = path + "/BiboxToken.png";
                    break;
                case "Dropil":
                    var imageLink = path + "/Dropil.png";
                    break;
                case "Coincode":
                    var imageLink = path + "/Coincode.png";
                    break;
                case "TenX":
                    var imageLink = path + "/tenx.png";
                    break;
                case "Polymath":
                    var imageLink = path + "/Polymath.png";
                    break;
                case "Emercoin":
                    var imageLink = path + "/emercoin.png";
                    break;
                case "Cardano":
                    var imageLink = path + "/cardano.png";
                    break;
                case "Stellar":
                    var imageLink = path + "/stellar.png";
                    break;
                case "IOTA":
                    var imageLink = path + "/iota.png";
                    break;
                case "NEO":
                    var imageLink = path + "/neo.png";
                    break;
                case "TRON":
                    var imageLink = path + "/tron.png";
                    break;
                case "Monero":
                    var imageLink = path + "/monero.png";
                    break;
                case "Dash":
                    var imageLink = path + "/dash.png";
                    break;
                case "NEM":
                    var imageLink = path + "/nem.png";
                    break;
                case "Tether":
                    var imageLink = path + "/tether.png";
                    break;
                case "OmiseGO":
                    var imageLink = path + "/OmiseGO.png";
                    break;
                case "VeChain":
                    var imageLink = path + "/VeChain.png";
                    break;
                case "Ethereum Classic":
                    var imageLink = path + "/ethereumClassic.png";
                    break;
                case "Qtum":
                    var imageLink = path + "/qtum.png";
                    break;
                case "Binance Coin":
                    var imageLink = path + "/binanceCoin.png";
                    break;
                case "ICON":
                    var imageLink = path + "/icon.png";
                    break;
                case "Bitcoin Gold":
                    var imageLink = path + "/bitcoin_gold.png";
                    break;
                case "Lisk":
                    var imageLink = path + "/lisk.png";
                    break;
                case "Zcash":
                    var imageLink = path + "/zcash.png";
                    break;
                case "Verge":
                    var imageLink = path + "/Verge.png";
                    break;
                case "Steem":
                    var imageLink = path + "/steem.png";
                    break;
                case "Bytom":
                    var imageLink = path + "/Bytom.png";
                    break;
                case "Bitcoin Private":
                    var imageLink = path + "/BitcoinPrivate.png";
                    break;
                case "Nano":
                    var imageLink = path + "/nano.png";
                    break;
                case "Bytecoin":
                    var imageLink = path + "/bytcoin.png";
                    break;
                case "Populous":
                    var imageLink = path + "/Populous.png";
                    break;
                case "Wanchain":
                    var imageLink = path + "/Wanchain.png";
                    break;
                case "Siacoin":
                    var imageLink = path + "/siacoin.png";
                    break;
                case "BitShares":
                    var imageLink = path + "/BitShares.png";
                    break;
                case "Bitcoin Diamond":
                    var imageLink = path + "/bitcoin_diamond.png";
                    break;
                case "Zilliqa":
                    var imageLink = path + "/Zilliqa.png";
                    break;
                case "Ontology":
                    var imageLink = path + "/ontology.png";
                    break;
                case "Aeternity":
                    var imageLink = path + "/Aeternity.png";
                    break;
                case "Maker":
                    var imageLink = path + "/maker.png";
                    break;
                case "Dogecoin":
                    var imageLink = path + "/dogecoin.png";
                    break;
                case "Decred":
                    var imageLink = path + "/Decred.png";
                    break;
                case "Stratis":
                    var imageLink = path + "/Stratis.png";
                    break;
                case "0x":
                    var imageLink = path + "/0x.png";
                    break;
                case "Mixin":
                    var imageLink = path + "/Mixin.png";
                    break;
                case "DigixDAO":
                    var imageLink = path + "/DigixDAO.png";
                    break;
                case "Waves":
                    var imageLink = path + "/waves.png";
                    break;
                case "RChain":
                    var imageLink = path + "/RChain.png";
                    break;
                case "Status":
                    var imageLink = path + "/Status.png";
                    break;
                case "Aion":
                    var imageLink = path + "/Aion.png";
                    break;
                case "Golem":
                    var imageLink = path + "/Golem.png";
                    break;
                case "Augur":
                    var imageLink = path + "/Augur.png";
                    break;
                case "Loopring":
                    var imageLink = path + "/Loopring.png";
                    break;
                case "Basic Attention Token":
                    var imageLink = path + "/BasicAttentionToken.png";
                    break;
                case "Kyber Network":
                    var imageLink = path + "/kyber_network.png";
                    break;
                case "Hshare":
                    var imageLink = path + "/Hshare.png";
                    break;
                case "Waltonchain":
                    var imageLink = path + "/Waltonchain.png";
                    break;
                case "IOST":
                    var imageLink = path + "/io_stoken.png";
                    break;
                case "Komodo":
                    var imageLink = path + "/komodo.png";
                    break;
                case "Ardor":
                    var imageLink = path + "/Ardor.png";
                    break;
                case "DigiByte":
                    var imageLink = path + "/digibyte.png";
                    break;
                case "KuCoin Shares":
                    var imageLink = path + "/KuCoinShares.png";
                    break;
                case "Ark":
                    var imageLink = path + "/Ark.png";
                    break;
                case "Centrality":
                    var imageLink = path + "/Centrality.png";
                    break;
                case "PIVX":
                    var imageLink = path + "/pivx.png";
                    break;
                case "Syscoin":
                    var imageLink = path + "/syscoin.png";
                    break;
                case "Mithril":
                    var imageLink = path + "/mithiril.png";
                    break;
                case "Substratum":
                    var imageLink = path + "/substratum.png";
                    break;
                case "aelf":
                    var imageLink = path + "/aelf.png";
                    break;
                case "MonaCoin":
                    var imageLink = path + "/MonaCoin.png";
                    break;
                case "Cryptonex":
                    var imageLink = path + "/Cryptonex.png";
                    break;
                case "Dragonchain":
                    var imageLink = path + "/Dragonchain.png";
                    break;
                case "Storm":
                    var imageLink = path + "/strom.png";
                    break;
                case "Gas":
                    var imageLink = path + "/Gas.png";
                    break;
                case "QASH":
                    var imageLink = path + "/QASH.png";
                    break;
                case "Dentacoin":
                    var imageLink = path + "/dentacoin.png";
                    break;
                case "Ethos":
                    var imageLink = path + "/ethos.png";
                    break;
                case "Factom":
                    var imageLink = path + "/Factom.png";
                    break;
                case "Pundi X":
                    var imageLink = path + "/pundi.png";
                    break;
                case "Nebulas":
                    var imageLink = path + "/Nebulas.png";
                    break;
                case "Cortex":
                    var imageLink = path + "/Cortex.png";
                    break;
                case "Veritaseum":
                    var imageLink = path + "/Veritaseum.png";
                    break;
                case "Bancor":
                    var imageLink = path + "/bancor.png";
                    break;
                case "ReddCoin":
                    var imageLink = path + "/reddcoin.png";
                    break;
                case "FunFair":
                    var imageLink = path + "/FunFair.png";
                    break;
                case "GXChain":
                    var imageLink = path + "/gxchain.png";
                    break;
                case "Elastos":
                    var imageLink = path + "/elastos.png";
                    break;
                case "SALT":
                    var imageLink = path + "/salt.png";
                    break;
                case "ZCoin":
                    var imageLink = path + "/zcoin.png";
                    break;
                case "Nxt":
                    var imageLink = path + "/nxt.png";
                    break;
                case "WAX":
                    var imageLink = path + "/WAX.png";
                    break;
                case "Kin":
                    var imageLink = path + "/kin.png";
                    break;
                case "Power Ledger":
                    var imageLink = path + "/power_ledger.png";
                    break;
                case "Monaco":
                    var imageLink = path + "/Monaco.png";
                    break;
                case "Revain":
                    var imageLink = path + "/Revain.png";
                    break;
                case "Enigma":
                    var imageLink = path + "/enigma.png";
                    break;
                case "Electroneum":
                    var imageLink = path + "/Electroneum.png";
                    break;
                case "Byteball Bytes":
                    var imageLink = path + "/byteball_bytes.png";
                    break;
                case "Nucleus Vision":
                    var imageLink = path + "/nucleus_vision.png";
                    break;
                case "MaidSafeCoin":
                    var imageLink = path + "/maid_safe.png";
                    break;
                case "ChainLink":
                    var imageLink = path + "/chain_link.png";
                    break;
                case "Gifto":
                    var imageLink = path + "/Gifto.png";
                    break;
                case "CyberMiles":
                    var imageLink = path + "/CyberMiles.png";
                    break;
                case "Fusion":
                    var imageLink = path + "/Fusion.png";
                    break;
                case "Huobi Token":
                    var imageLink = path + "/huobiToken.png";
                    break;
                case "Loom Network":
                    var imageLink = path + "/loomNetwork.png";
                    break;
                case "MOAC":
                    var imageLink = path + "/moac.png";
                    break;
                case "Skycoin":
                    var imageLink = path + "/skycoin.png";
                    break;
                case "Theta Token":
                    var imageLink = path + "/ThetaToken.png";
                    break;
                case "Nuls":
                    var imageLink = path + "/nuls.png";
                    break;
                default:
                    var imageLink = path + "/default_coin.png";
            }
            newArray.push({
                name: responseArray[i].name,
                symbol: responseArray[i].symbol,
                buyingPriceUsd: Number((buyingPrice)),
                sellingPriceUsd: Number((sellingPrice)),
                percentChange24h: responseArray[i].quotes.USD.percent_change_24h,
                img: imageLink,
                updatedAt: new Date().toISOString(),
                percentChange7d: responseArray[i].quotes.USD.percent_change_7d,
                percentChange1h: responseArray[i].quotes.USD.percent_change_1h,
                marketCap: responseArray[i].quotes.USD.market_cap,
                availableSupply: responseArray[i].circulating_supply,
                totalSupply: responseArray[i].total_supply,
                maxSupply: responseArray[i].max_supply,
                rank: responseArray[i].rank,
            });

        }
        return newArray;
    }
    return updateFunction;
}
module.exports = app => {
    app.route('/favourites').post((req, res) => {
        const validator = {
            symbol: Joi.string().required(),
            exchangeCurrencyFrom: Joi.string().required(),
            userId: Joi.string().required(),
            percent_change_24h: Joi.string().required(),
            price: Joi.number().required(),
            volume24h: Joi.number().required(),
            img: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.cryptoController.addFavourite(req.body, (err, cryptodata) => {
            console.log(err, cryptodata);
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err
                })
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "Added to Favourites"
                })
            }
        })
    })

    app.route('/deleteFavourites').post((req, res) => {
        const validator = {
            symbol: Joi.string().required(),
            exchangeCurrencyFrom: Joi.string().required(),
            userId: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.cryptoController.deleteFavourite(req.body, (err, cryptodata) => {
            console.log(err, cryptodata);
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err
                })
                return;
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "deleted Successfully"
                })
            }
        })
    })

    app.route('/fetchFavourites').post((req, res) => {
        const validator = {
            userId: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.cryptoController.fetchFavourite(req.body, (err, cryptodata) => {
            console.log(err, cryptodata);
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
                    "count": cryptodata.length,
                    "data": cryptodata
                })
            }
        })
    })
    // app.route('/fetchOneCurrency').post(function (req, res) {
    //     const validator = {
    //         symbol: Joi.string().required(),
    //         exchangeCurrencyFrom: Joi.string().optional(),
    //         userId: Joi.string().optional(),
    //     }
    //     const bodyValidation = Joi.validate(req.body, validator);
    //     if (bodyValidation.error) {
    //         res.status(400).send({
    //             "Message": bodyValidation.error.message
    //         });
    //         return;
    //     }
    //     Controller.coinMarketController.fetchOneCurrency(req.body, function (err, data) {
    //         console.log(err, data)
    //         if (err) {
    //             res.status(400).send({
    //                 "Status": "0",
    //                 "Message": err
    //             })
    //             return;
    //         } else {
    //             if (req.body.userId && req.body.exchangeCurrencyFrom) {
    //                 var body = {
    //                     userId: req.body.userId,
    //                     symbol: req.body.exchangeCurrencyFrom
    //                 }
    //                 Controller.walletController.fetchWalletDetails(body, function (err, walletDetailsFrom) {
    //                     if (err) {
    //                         return err.message;
    //                     } else {
    //                         //var balanceFrom = walletDetails.
    //                         console.log(walletDetailsFrom, "walletDetail==============");
    //                         var body = {
    //                             userId: req.body.userId,
    //                             symbol: req.body.symbol
    //                         }
    //                         Controller.walletController.fetchWalletDetails(body, function (err, walletDetailsTo) {
    //                             if (err) {
    //                                 return err.message;
    //                             } else {
    //                                 var criteria = {
    //                                     symbol: req.body.symbol
    //                                 };
    //                                 Controller.adminController.fetchOne(criteria, function (err, adminData) {
    //                                     if (err) {
    //                                         return err.message;
    //                                     } else {
    //                                         var contractBuyRateUSD = parseFloat(data.price_usd);
    //                                         var contractBuyRateBTC = parseFloat(data.price_btc);
    //                                         var contractBuyRateETH = parseFloat(data.price_eth);
    //                                         var contractBuyRateINR = parseFloat(data.price_inr);
    //                                         var contractSellRateUSD = parseFloat(data.sellrate_USD);
    //                                         var contractSellRateBTC = parseFloat(data.sellrate_BTC);
    //                                         var contractSellRateETH = parseFloat(data.sellrate_ETH);
    //                                         var contractSellRateINR = parseFloat(data.sellrate_INR);
    //                                         contractBuyRateUSD += (contractBuyRateUSD * adminData.contractBuyRate / 100);
    //                                         contractBuyRateBTC += (contractBuyRateBTC * adminData.contractBuyRate / 100);
    //                                         contractBuyRateETH += (contractBuyRateETH * adminData.contractBuyRate / 100);
    //                                         contractBuyRateINR += (contractBuyRateINR * adminData.contractBuyRate / 100);
    //                                         contractSellRateUSD += (contractSellRateUSD * adminData.contractSellRate / 100);
    //                                         contractSellRateBTC += (contractSellRateBTC * adminData.contractSellRate / 100);
    //                                         contractSellRateETH += (contractSellRateETH * adminData.contractSellRate / 100);
    //                                         contractSellRateINR += (contractSellRateINR * adminData.contractSellRate / 100);
    //                                         //var balanceTo = walletDetails.
    //                                         console.log(contractBuyRateUSD, (contractBuyRateUSD * adminData.contractBuyRate / 100), "walletDetail==============");
    //                                         res.status(200).send({
    //                                             "Status": "1",
    //                                             "Message": "Success",
    //                                             "walletBalanceFrom": walletDetailsFrom[0].wallet[0].balance,
    //                                             "walletsBalanceTo": walletDetailsTo[0].wallet[0].balance,
    //                                             "marginBalanceFrom": walletDetailsFrom[0].wallet[0].sMargin,
    //                                             "contractBuyRateUSD": contractBuyRateUSD,
    //                                             "contractBuyRateBTC": contractBuyRateBTC,
    //                                             "contractBuyRateETH": contractBuyRateETH,
    //                                             "contractBuyRateINR": contractBuyRateINR,
    //                                             "contractSellRateUSD": contractSellRateUSD,
    //                                             "contractSellRateBTC": contractSellRateBTC,
    //                                             "contractSellRateETH": contractSellRateETH,
    //                                             "contractSellRateINR": contractSellRateINR,
    //                                             "fees": adminData.fees,
    //                                             "gst": adminData.gst,
    //                                             "contractFees": 0,
    //                                             "data": data,
    //                                         })
    //                                     }
    //                                 })
    //                             }
    //                         })
    //                     }
    //                 })
    //             } else {
    //                 res.status(200).send({
    //                     "Status": "1",
    //                     "Message": "Success",
    //                     "data": data
    //                 })
    //             }
    //         }
    //     });
    // });
    // app.route('/fetchOne').get((req, res) => {
    //     const validator = {
    //         symbol: Joi.string().required(),
    //     }
    //     const bodyValidation = Joi.validate(req.body, validator);
    //     if (bodyValidation.error) {
    //         res.status(400).send({
    //             "Message": bodyValidation.error.message
    //         });
    //         return;
    //     }
    //     Controller.cryptoController.fetchOneCryptoData(req.body, (err, result) => {
    //         if (err) {
    //             res.status(400).send({
    //                 "Status": "0",
    //                 "Message": err
    //             });
    //         } else {
    //             res.status(200).send({
    //                 "Status": "1",
    //                 "Message": "Success",
    //                 "data": result
    //             })
    //         }
    //     })
    // })

    app.route('/fetchOneCurrency').post((req, res) => {
        const validator = {
            symbol: Joi.string().required(),
            exchangeCurrencyFrom: Joi.string().required(),
            userId: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.cryptoController.fetchOneCryptoData(req.body, (err, cryptodata) => {
            console.log(err, cryptodata);
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err
                })
                return;
            } else {
                CryptoData = cryptodata
                console.log(CryptoData.buyingPriceUsd, "CRYPTODATA++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                var body = {
                    userId: req.body.userId,
                    symbol: req.body.exchangeCurrencyFrom
                }
                Controller.walletController.fetchWalletDetails(body, (err, walletDetailsFrom) => {
                    if (err) {
                        return err.message;
                    } else {
                        console.log(walletDetailsFrom, "walletDetail==============");
                        var body = {
                            userId: req.body.userId,
                            symbol: req.body.symbol
                        }
                        Controller.walletController.fetchWalletDetails(body, (err, walletDetailsT) => {
                            if (err) {
                                return err.message;
                            } else {
                                walletDetailsTo = walletDetailsT;
                                var criteria = {
                                    symbol: req.body.symbol
                                };
                                Controller.adminController.fetchOne(criteria, (err, adminData) => {
                                    if (err) {
                                        return err.message;
                                    } else {
                                        var contractBuyRateUSD = CryptoData.buyingPriceUsd;
                                        var contractBuyRateBTC = CryptoData.buyingPriceBtc
                                        var contractBuyRateETH = CryptoData.buyingPriceEth
                                        var contractBuyRateCCD = CryptoData.buyingPriceCcd
                                        var contractSellRateUSD = CryptoData.sellingPriceUsd
                                        var contractSellRateBTC = CryptoData.sellingPriceBtc
                                        var contractSellRateETH = CryptoData.sellingPriceEth
                                        var contractSellRateCCD = CryptoData.sellingPriceCcd
                                        contractBuyRateUSD += (contractBuyRateUSD * adminData.contractBuyRate / 100);
                                        contractBuyRateBTC += (contractBuyRateBTC * adminData.contractBuyRate / 100);
                                        contractBuyRateETH += (contractBuyRateETH * adminData.contractBuyRate / 100);
                                        contractBuyRateCCD += (contractBuyRateCCD * adminData.contractBuyRate / 100);
                                        contractSellRateUSD += (contractSellRateUSD * adminData.contractSellRate / 100);
                                        contractSellRateBTC += (contractSellRateBTC * adminData.contractSellRate / 100);
                                        contractSellRateETH += (contractSellRateETH * adminData.contractSellRate / 100);
                                        contractSellRateCCD += (contractSellRateCCD * adminData.contractSellRate / 100);
                                        res.status(200).send({
                                            "Status": "1",
                                            "Message": "Success",
                                            "walletBalanceFrom": walletDetailsFrom[0].wallet[0].balance,
                                            "walletsBalanceTo": walletDetailsTo[0].wallet[0].balance,
                                            "marginBalanceFrom": walletDetailsFrom[0].wallet[0].sMargin,
                                            "contractBuyRateUSD": contractBuyRateUSD,
                                            "contractBuyRateBTC": contractBuyRateBTC,
                                            "contractBuyRateETH": contractBuyRateETH,
                                            "contractBuyRateCCD": contractBuyRateCCD,
                                            "contractSellRateUSD": contractSellRateUSD,
                                            "contractSellRateBTC": contractSellRateBTC,
                                            "contractSellRateETH": contractSellRateETH,
                                            "contractSellRateCCD": contractSellRateCCD,
                                            "fees": adminData.fees,
                                            "gst": adminData.gst,
                                            "contractFees": 0,
                                            "minQuantity": adminData.minimumQuantity,
                                            "data": cryptodata,
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })

    app.route('/fetchOneCryptoRate').post((req, res) => {
        const validator = {
            symbol: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.cryptoController.fetchOneCryptoData(req.body, (err, cryptodata) => {
            console.log(err, cryptodata);
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
                    "data": cryptodata,
                })
            }
        })
    })
    app.route('/checkGraphData').get((req, res) => {
        Controller.cryptoController.fetchGraphData((err, result) => {
            if (err) {
                res.status(400).send({
                    "Status": "0",
                    "Message": err
                });
            } else {
                res.status(200).send({
                    "Status": "1",
                    "Message": "Graph Data",
                    "data": result
                })
            }
        })
    })
    app.route('/graphCryptoRates').get((req, res) => {
        request(Config.URL.coincapURL, (err, resp, body) => {
            if (err) {
                return err.Message;
            } else {
                var response = JSON.parse(body);
                //console.log(response.data, "Response")
                var result = Object.keys(response.data).map(key => {
                    return [Number(key), response.data[key]];
                });
                responseArray = Object.values(response.data);
                responseArray.push({
                    "id": 8888,
                    "name": "Coincode",
                    "symbol": "CCD",
                    "website_slug": "coincode",
                    "rank": 1,
                    "circulating_supply": 17171662,
                    "total_supply": 17171662,
                    "max_supply": 21000000,
                    "quotes": {
                        "USD": {
                            "price": 8.786,
                            "volume_24h": 10000000,
                            "market_cap": 141000466164,
                            "percent_change_1h": 0.11,
                            "percent_change_24h": 1.05,
                            "percent_change_7d": 11.75
                        }
                    },
                    "last_updated": Math.floor(Date.now() / 1000)
                })
                Controller.adminController.viewAdminData((err, result) => {
                    if (err) {
                        return err.message;
                    } else {
                        console.log("AdminData:", result);
                        adminData = result
                        newArray = [];
                        console.log(responseArray.length, "LENGTH");
                        for (var j = 0; j < adminData.length; j++) {
                            for (var i = 0; i < responseArray.length; i++) {
                                var adminclosure = closureForAdmin(i);
                                var resulting = adminclosure(j);
                            }
                        }
                        newArray.sort(function (a, b) {
                            return a.rank - b.rank
                        });
                        console.log(newArray, "NEWARRAY");
                        Controller.cryptoController.insertGraphRates(newArray, (err, newdata) => {
                            if (err) {
                                return err.message
                            } else {
                                console.log(newdata, "Data saved successfully");
                            }
                        })
                        // var updateCriteria = {
                        //     "symbol": newArray[i].symbol
                        // };
                        // var dataToUpdate = newArray[i];
                        // for (var i = 0; i < newArray.length; i++) {
                        //     Controller.coinMarketController.updateCryptoRates(updateCriteria, dataToUpdate, function (err, data) {
                        //         if (err) {
                        //             return err.message
                        //         } else {
                        //             console.log(data);
                        //         }
                        //     })
                        // }
                        res.status(200).send({
                            "Status": "1",
                            "Message": "Rates",
                            "data": newArray
                        });
                    }
                })
            }
        })
    })
    app.route('/updateCryptoRates').get((req, res) => {
        request(Config.URL.coincapURL, (err, resp, body) => {
            if (err) {
                return err.Message;
            } else {
                var response = JSON.parse(body);
                //console.log(response.data, "Response")
                var result = Object.keys(response.data).map(key => {
                    return [Number(key), response.data[key]];
                });
                responseArray = Object.values(response.data);
                responseArray.push({
                    "id": 8888,
                    "name": "Coincode",
                    "symbol": "CCD",
                    "website_slug": "coincode",
                    "rank": 1,
                    "circulating_supply": 17171662,
                    "total_supply": 17171662,
                    "max_supply": 21000000,
                    "quotes": {
                        "USD": {
                            "price": 8.786,
                            "volume_24h": 10000000,
                            "market_cap": 141000466164,
                            "percent_change_1h": 0.11,
                            "percent_change_24h": 1.05,
                            "percent_change_7d": 11.75,
                        }
                    },
                    "last_updated": Math.floor(Date.now() / 1000)
                })
                ///**************RUN IT INITIALLY FOR ADDING FAKE ENTRIES IN ADMIN DB, IN ORDER TO GET LIVE RATES////////////////////////
                // for (var i = 0; i < responseArray.length; i++) {
                //     var admincriteria = {
                //         symbol:responseArray[i].symbol ,
                //         sellRate: 1,
                //         gst:0,
                //         buyRate: 1,
                //         fees:1,
                //         contractBuyRate:1,
                //         contractSellRate:1,
                //         margin:1,
                //         minimumQuantity:1,
                //     }
                //     console.log(admincriteria,"ADMINCRITERIA",i);
                //     Controller.adminController.saveAdminData(admincriteria , (err, result) => {
                //         if (err) {
                //             return err.message;
                //         } else {
                //             console.log(`saved Suceesfully`)
                //         }
                //     })
                // }
                Controller.adminController.viewAdminData((err, result) => {
                    if (err) {
                        return err.message;
                    } else {
                        console.log("AdminData:", result);
                        adminData = result
                        newArray = [];
                        console.log(responseArray.length, "LENGTH");
                        for (var j = 0; j < adminData.length; j++) {
                            for (var i = 0; i < responseArray.length; i++) {
                                var adminclosure = closureForUpdateData(i);
                                var resulting = adminclosure(j);
                            }
                        }
                        console.log(newArray, "NEWARRAY");
                        // for (var i = 0; i < newArray.length; i++) {
                        //     newArray[i].buyingPriceCcd = newArray[i].buyingPriceUsd * ccdFactorBuy;
                        //     newArray[i].sellingPriceCcd = newArray[i].sellingPriceUsd * ccdFactorSell;
                        //     newArray[i].buyingPriceBtc = newArray[i].buyingPriceUsd * btcFactorBuy;
                        //     newArray[i].sellingPriceBtc = newArray[i].sellingPriceUsd * btcFactorSell;
                        //     newArray[i].buyingPriceEth = newArray[i].buyingPriceUsd * ethFactorBuy;
                        //     newArray[i].sellingPriceEth = newArray[i].sellingPriceUsd * ethFactorSell;
                        // }
                        // Controller.cryptoController.insertCryptoRates(newArray, (err, newdata) => {
                        //     if (err) {
                        //         return err.message
                        //     } else {
                        //         console.log(newdata, "Data saved successfully");
                        //     }
                        // })
                        var updateCriteria;
                        var dataToUpdate;
                        newArray.sort((a, b) => {
                            return a.rank - b.rank
                        });
                        for (var i = 0; i < newArray.length; i++) {
                            if (newArray[i].maxSupply == null) {
                                newArray[i].maxSupply = 0
                            }
                            newArray[i].buyingPriceCcd = newArray[i].buyingPriceUsd * ccdFactorBuy;
                            newArray[i].sellingPriceCcd = newArray[i].sellingPriceUsd * ccdFactorSell;
                            newArray[i].buyingPriceBtc = newArray[i].buyingPriceUsd * btcFactorBuy;
                            newArray[i].sellingPriceBtc = newArray[i].sellingPriceUsd * btcFactorSell;
                            newArray[i].buyingPriceEth = newArray[i].buyingPriceUsd * ethFactorBuy;
                            newArray[i].sellingPriceEth = newArray[i].sellingPriceUsd * ethFactorSell;
                            updateCriteria = {
                                symbol: newArray[i].symbol
                            };
                            dataToUpdate = newArray[i];
                            Controller.cryptoController.updateCryptoRates(updateCriteria, dataToUpdate, (err, data) => {
                                if (err) {
                                    return err.message
                                } else {
                                    console.log(data);
                                }
                            })
                        }
                        res.status(200).send({
                            "Status": "1",
                            "Message": "Rates",
                            "data": newArray
                        });
                    }
                })
            }
        })
    })
    app.route('/CryptoRates').post((req, res) => {
        const validator = {
            symbol: Joi.string().required(),
            //name: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        Controller.adminController.viewAdminData((err, result) => {
            if (err) {
                return err.message;
            } else {
                console.log("AdminData:", result);
                adminData = result
                return adminData;
            }
        })

        // var exchangeRate = request(Config.URL.conversionURL, (err, respns, convertedbody) => {
        //     if (err) {
        //         return err.Message;
        //     } else {
        //         var convertedRates = JSON.parse(convertedbody);
        //         return convertedRates.rates.INR;
        //     }
        // })
        request(Config.URL.coincapURL, (err, resp, body) => {
            if (err) {
                return err.Message;
            } else {
                var response = JSON.parse(body);
                console.log(response.data, "Response")
                var result = Object.keys(response.data).map(key => {
                    return [Number(key), response.data[key]];
                });
                responseArray = Object.values(response.data);
                responseArray.push({
                    "id": 8888,
                    "name": "Coincode",
                    "symbol": "CCD",
                    "website_slug": "coincode",
                    "rank": 1,
                    "circulating_supply": 17171662,
                    "total_supply": 17171662,
                    "max_supply": 21000000,
                    "quotes": {
                        "USD": {
                            "price": 8.786,
                            "volume_24h": 10000000,
                            "market_cap": 141000466164,
                            "percent_change_1h": 0.11,
                            "percent_change_24h": 1.05,
                            "percent_change_7d": 11.75
                        }
                    },
                    "last_updated": Math.floor(Date.now() / 1000)
                })
                Controller.adminController.viewAdminData((err, result) => {
                    if (err) {
                        return err.message;
                    } else {

                        adminData = result
                        switch (req.body.symbol) {
                            case "BTC":
                                newArray = [];
                                console.log(responseArray.length, "LENGTH");
                                for (var j = 0; j < adminData.length; j++) {
                                    for (var i = 0; i < responseArray.length; i++) {
                                        var adminclosure = closureForAdmin(i);
                                        var resulting = adminclosure(j);
                                    }
                                }
                                console.log(newArray.length, "NEWLENGTH");
                                for (var i = 0; i < newArray.length; i++) {
                                    newArray[i].buyingPriceBtc = newArray[i].buyingPriceUsd * btcFactorBuy;
                                    newArray[i].sellingPriceBtc = newArray[i].sellingPriceUsd * btcFactorSell;
                                }
                                newArray.sort(function (a, b) {
                                    return a.rank - b.rank
                                });
                                res.status(200).send({
                                    "Status": "1",
                                    "Message": "Bitcoin Rates",
                                    "data": newArray
                                });
                                break;
                            case "ETH":
                                newArray = [];
                                console.log(responseArray.length, "LENGTH");
                                for (var j = 0; j < adminData.length; j++) {
                                    for (var i = 0; i < responseArray.length; i++) {
                                        var adminclosure = closureForAdmin(i);
                                        var resulting = adminclosure(j);
                                    }
                                }
                                console.log(newArray.length, "NEWLENGTH");
                                for (var i = 0; i < newArray.length; i++) {
                                    newArray[i].buyingPriceEth = newArray[i].buyingPriceUsd * ethFactorBuy;
                                    newArray[i].sellingPriceEth = newArray[i].sellingPriceUsd * ethFactorSell;
                                }
                                newArray.sort(function (a, b) {
                                    return a.rank - b.rank
                                });
                                res.status(200).send({
                                    "Status": "1",
                                    "Message": "Eth Rates",
                                    "data": newArray
                                });
                                break;
                                // case "INR":
                                // res.status(200).send({
                                //     "Status": "1",
                                //     "Message": "CCD Rates",
                                //     "data": {"}
                                // })
                                //     break;
                            case "CCD":
                                newArray = [];
                                console.log(responseArray.length, "LENGTH");
                                for (var j = 0; j < adminData.length; j++) {
                                    for (var i = 0; i < responseArray.length; i++) {
                                        var adminclosure = closureForAdmin(i);
                                        var resulting = adminclosure(j);
                                    }
                                }
                                console.log(newArray.length, "NEWLENGTH");
                                for (var i = 0; i < newArray.length; i++) {
                                    newArray[i].buyingPriceCcd = newArray[i].buyingPriceUsd * ccdFactorBuy;
                                    newArray[i].sellingPriceCcd = newArray[i].sellingPriceUsd * ccdFactorSell;
                                }
                                newArray.sort(function (a, b) {
                                    return a.rank - b.rank
                                });
                                res.status(200).send({
                                    "Status": "1",
                                    "Message": "Coincode Rates",
                                    "data": newArray
                                });
                                break;
                            case "USDT":
                                newArray = [];
                                console.log(responseArray.length, "LENGTH");
                                for (var j = 0; j < adminData.length; j++) {
                                    for (var i = 0; i < responseArray.length; i++) {
                                        var adminclosure = closureForAdmin(i);
                                        var resulting = adminclosure(j);
                                    }
                                }
                                newArray.sort((a, b) => {
                                    return a.rank - b.rank
                                });
                                res.status(200).send({
                                    "Status": "1",
                                    "Message": "Bitcoin Rates",
                                    "data": newArray
                                });
                                break;
                        }
                    }
                })

            }
        })

    })

/////////////////////Graph Chart//////////////////////////
    app.route('/graphChart').post((req, res) => {

        const validator = {
            symbol: Joi.string().required(),
            exchangeCurrencyFrom: Joi.string().required(),
            period: Joi.string().required(),
        }
        const bodyValidation = Joi.validate(req.body, validator);
        if (bodyValidation.error) {
            res.status(400).send({
                "Message": bodyValidation.error.message
            });
            return;
        }
        var ul = req.body.symbol + req.body.exchangeCurrencyFrom + '?' + req.body.period;
        var url = urljoin(Config.URL.hitbtcURL, ul);
        // var response1 = '{"data":[{"open":"123456", "close":"52035"},{"open":"111111", "close":"9999999"}]}';
        request(url, (err, resp, body) => {
            // console.log(Config.URL.coincapURL, "----C O I N C A P  U R L---")
            if (err) {
                return err.Message;
            } else {
                var graphArray = JSON.parse(body);
                var graphArrayData = [];
                for (var i = 0; i < graphArray.length; i++) {
                    var newArray = [];
                    
                    var dte = new Date(graphArray[i].timestamp);
                    var ndte = dte.getTime();
                    
                    var opn = graphArray[i].open;
                    var openNum = parseFloat(opn);

                    var cls = graphArray[i].close;
                    var closeNum = parseFloat(cls);

                    var mn = graphArray[i].min;
                    var minNum = parseFloat(mn);

                    var mx = graphArray[i].max;
                    var maxNum = parseFloat(mx);
                    // console.log(pointNum+"+++++++++++")

                    newArray.push(ndte, openNum, closeNum, minNum, maxNum);
                    graphArrayData.push(newArray);
                }
             
                res.status(200).send(
                    graphArrayData
                );
            }
        })
    })
    // app.route('/getCryptoRates').get((req, res) => {
    //     request(Config.URL.coincapURL, (err, resp, body) => {
    //         if (err) {
    //             return err.Message;
    //         } else {
    //             request(Config.URL.conversionURL, (err, respns, convertedbody) => {
    //                 if (err) {
    //                     return err.Message;
    //                 } else {
    //                     var convertedRates = JSON.parse(convertedbody);
    //                     var response = JSON.parse(body);
    //                     var result = Object.keys(response.data).map(function (key) {
    //                         return [Number(key), response.data[key]];
    //                     });
    //                     //console.log(result,"NEWRESULT");
    //                     var responseArray = Object.values(response.data);
    //                     var arrayToSave = [];
    //                     console.log(responseArray[0].quotes.USD.price, "LENGTH+_________________");
    //                     for (var i = 0; i < responseArray.length; i++) {
    //                         if (responseArray[i].symbol == "ETH") {
    //                             var ethFactor = 1 / responseArray[i].quotes.USD.price;
    //                         }
    //                         if (responseArray[i].symbol == "BTC") {
    //                             var btcFactor = 1 / responseArray[i].quotes.USD.price;
    //                         }
    //                     }
    //                     console.log(ethFactor, "EthFactor");
    //                     for (var i = 0; i < responseArray.length; i++) {
    //                         if (responseArray[i].max_supply == null) {
    //                             responseArray[i].max_supply = 0;
    //                         }
    //                         if (ethFactor) {
    //                             responseArray[i].buyingPriceEth = responseArray[i].quotes.USD.price * ethFactor;
    //                         }
    //                         if (btcFactor) {
    //                             responseArray[i].buyingPriceBtc = responseArray[i].quotes.USD.price * btcFactor;
    //                         }
    //                         responseArray[i].contBuyingPriceEth = 1;
    //                         responseArray[i].contBuyingPriceUsd = 1;
    //                         responseArray[i].contBuyingPriceInr = 1;
    //                         responseArray[i].contBuyingPriceBtc = 1;
    //                         responseArray[i].contBuyingPriceCcd = 1;
    //                         responseArray[i].contSellingPriceEth = 1;
    //                         responseArray[i].contSellingPriceInr = 1;
    //                         responseArray[i].contSellingPriceUsd = 1;
    //                         responseArray[i].contSellingPriceBtc = 1;
    //                         responseArray[i].contSellingPriceCcd = 1;
    //                         responseArray[i].buyingPriceUsd = responseArray[i].quotes.USD.price;
    //                         responseArray[i].buyingPriceCcd = 100;
    //                         responseArray[i].buyingPriceInr = convertedRates.rates.INR * responseArray[i].quotes.USD.price
    //                         responseArray[i].sellingPriceEth = responseArray[i].quotes.USD.price * ethFactor;
    //                         responseArray[i].sellingPriceUsd = responseArray[i].quotes.USD.price;
    //                         responseArray[i].sellingPriceCcd = 100;
    //                         responseArray[i].sellingPriceInr = convertedRates.rates.INR * responseArray[i].quotes.USD.price
    //                         responseArray[i].sellingPriceBtc = responseArray[i].quotes.USD.price * btcFactor;
    //                         //responseArray[i].volume24h = responseArray[i].quotes.USD.volume_24h;
    //                         //responseArray[i].marketCap = responseArray[i].quotes.USD.market_cap;
    //                         //responseArray[i].percentChange1h = responseArray[i].quotes.USD.percent_change_1h;
    //                         responseArray[i].percentChange24h = responseArray[i].quotes.USD.percent_change_24h;
    //                         //responseArray[i].percentChange7d = responseArray[i].quotes.USD.percent_change_7d;
    //                         //responseArray[i].
    //                     }
    //                     console.log(arrayToSave, "ARRAYTOSAVE");
    //                     service.saveCryptoRates(responseArray, function (err, data) {
    //                         if (err) {
    //                             return errr.message;
    //                         } else {
    //                             res.status(200).send({
    //                                 "Status": "1",
    //                                 "Message": "Updated Succesfully",
    //                                 "data": data
    //                             })
    //                         }
    //                     })
    //                     // res.status(200).send({
    //                     //     "Status": "1",
    //                     //     "Message": "Updated Succesfully",
    //                     //     "data": "data",
    //                     // })
    //                 }
    //             })
    //         }
    //     })

    // })
}


//////*********************************************************************************************** */
// app.route('/updateData').get((req, res) => {
//     Controller.coinMarketController.findDetail(function (err, data) {
//         if (err) {
//             return err.Message;
//         } else {
//             //console.log(data, "====================================================================data")
//             recievedDetails = data;
//             //console.log(recievedDetails,"(((((((((((((((((((((((((((((((((")
//             return recievedDetails;
//         }
//     })
//     Controller.adminController.viewAdminData(function (err, data) {
//         console.log(err, data)
//         if (err) {
//             return err.Message;
//         } else {
//             // console.log(data, "====================================================================data")
//             recievedAdminData = data;
//             return recievedAdminData;
//         }
//     });
//     request(Config.URL.liveRateURL, function (err, resp, body) {
//         if (err) {
//             return err.Message;
//         }
//         var newbody = JSON.parse(body);
//         for (var i = 0; i < newbody.length; i++) {
//             if (newbody[i].symbol == "ETH") {
//                 ETHfactor = (1 / newbody[i].price_usd);
//             }
//         }
//         request(Config.URL.conversionURL, function (err, respns, convertedbody) {
//             if (err) {
//                 return err.Message;
//             }
//             convertedRates = JSON.parse(convertedbody);
//             for (var i = 0; i < newbody.length; i++) {
//                 if (newbody[i].max_supply == null) {
//                     newbody[i].max_supply = "";
//                 }
//                 // Controller.walletController.updateWalletDetails(newbody[i].symbol,newbody[i].name,function(err,data){
//                 //     if(err){
//                 //         return err.message;
//                 //     }
//                 // })
//                 newbody[i].difference = "0";
//                 newbody[i].price_inr = (newbody[i].price_usd * convertedRates.rates.INR).toFixed(2);
//                 newbody[i].price_eth = (newbody[i].price_usd * ETHfactor).toFixed(6);
//                 newbody[i].sellrate_INR = newbody[i].price_inr;
//                 newbody[i].sellrate_USD = newbody[i].price_usd;
//                 newbody[i].sellrate_ETH = newbody[i].price_eth;
//                 newbody[i].sellrate_BTC = newbody[i].price_btc;
//                 if (recievedAdminData) {
//                     // console.log(recievedAdminData, "======================================================recievedAdminData")
//                     for (var j = 0; j < recievedAdminData.length; j++) {
//                         if (recievedAdminData[j].currencysymbol == newbody[i].symbol) {
//                             newbody[i].price_inr = (newbody[i].price_inr * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_usd = (newbody[i].price_usd * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_INR = (newbody[i].price_inr * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_USD = (newbody[i].price_usd * recievedAdminData[j].sellrate).toString();
//                             newbody[i].price_eth = (newbody[i].price_eth * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_btc = (newbody[i].price_btc * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_ETH = (newbody[i].price_eth * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_BTC = (newbody[i].price_btc * recievedAdminData[j].sellrate).toString();
//                             newbody[i].fees = recievedAdminData[j].fees;
//                             newbody[i].gst = recievedAdminData[j].gst;
//                         }
//                     }
//                 }
//                 for (var j = 0; j < recievedDetails.length; j++) {
//                     if (recievedDetails[j].symbol == newbody[i].symbol) {
//                         newbody[i].difference = (recievedDetails[j].percent_change_24h - newbody[i].percent_change_24h).toString();
//                         // console.log(newbody[i].percent_change_24h,"===========================================")
//                     }
//                 }
//                 switch (newbody[i].name) {
//                     case "Bitcoin":
//                         newbody[i].img = path + "/bitcoin.png";
//                         break;
//                     case "Ethereum":
//                         newbody[i].img = path + "/ethereum.png";
//                         break;
//                     case "Ripple":
//                         newbody[i].img = path + "/ripple.png";
//                         break;
//                     case "Bitcoin Cash":
//                         newbody[i].img = path + "/bitcoincash.png";
//                         break;
//                     case "EOS":
//                         newbody[i].img = path + "/eos.png";
//                         break;
//                     case "Litecoin":
//                         newbody[i].img = path + "/litecoin.png";
//                         break;  // app.route('/updateData').get((req, res) => {
//     Controller.coinMarketController.findDetail(function (err, data) {
//         if (err) {
//             return err.Message;
//         } else {
//             //console.log(data, "====================================================================data")
//             recievedDetails = data;
//             //console.log(recievedDetails,"(((((((((((((((((((((((((((((((((")
//             return recievedDetails;
//         }
//     })
//     Controller.adminController.viewAdminData(function (err, data) {
//         console.log(err, data)
//         if (err) {
//             return err.Message;
//         } else {
//             // console.log(data, "====================================================================data")
//             recievedAdminData = data;
//             return recievedAdminData;
//         }
//     });
//     request(Config.URL.liveRateURL, function (err, resp, body) {
//         if (err) {
//             return err.Message;
//         }
//         var newbody = JSON.parse(body);
//         for (var i = 0; i < newbody.length; i++) {
//             if (newbody[i].symbol == "ETH") {
//                 ETHfactor = (1 / newbody[i].price_usd);
//             }
//         }
//         request(Config.URL.conversionURL, function (err, respns, convertedbody) {
//             if (err) {
//                 return err.Message;
//             }
//             convertedRates = JSON.parse(convertedbody);
//             for (var i = 0; i < newbody.length; i++) {
//                 if (newbody[i].max_supply == null) {
//                     newbody[i].max_supply = "";
//                 }
//                 // Controller.walletController.updateWalletDetails(newbody[i].symbol,newbody[i].name,function(err,data){
//                 //     if(err){
//                 //         return err.message;
//                 //     }
//                 // })
//                 newbody[i].difference = "0";
//                 newbody[i].price_inr = (newbody[i].price_usd * convertedRates.rates.INR).toFixed(2);
//                 newbody[i].price_eth = (newbody[i].price_usd * ETHfactor).toFixed(6);
//                 newbody[i].sellrate_INR = newbody[i].price_inr;
//                 newbody[i].sellrate_USD = newbody[i].price_usd;
//                 newbody[i].sellrate_ETH = newbody[i].price_eth;
//                 newbody[i].sellrate_BTC = newbody[i].price_btc;
//                 if (recievedAdminData) {
//                     // console.log(recievedAdminData, "======================================================recievedAdminData")
//                     for (var j = 0; j < recievedAdminData.length; j++) {
//                         if (recievedAdminData[j].currencysymbol == newbody[i].symbol) {
//                             newbody[i].price_inr = (newbody[i].price_inr * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_usd = (newbody[i].price_usd * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_INR = (newbody[i].price_inr * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_USD = (newbody[i].price_usd * recievedAdminData[j].sellrate).toString();
//                             newbody[i].price_eth = (newbody[i].price_eth * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_btc = (newbody[i].price_btc * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_ETH = (newbody[i].price_eth * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_BTC = (newbody[i].price_btc * recievedAdminData[j].sellrate).toString();
//                             newbody[i].fees = recievedAdminData[j].fees;
//                             newbody[i].gst = recievedAdminData[j].gst;
//                         }
//                     }
//                 }
//                 for (var j = 0; j < recievedDetails.length; j++) {
//                     if (recievedDetails[j].symbol == newbody[i].symbol) {
//                         newbody[i].difference = (recievedDetails[j].percent_change_24h - newbody[i].percent_change_24h).toString();
//                         // console.log(newbody[i].percent_change_24h,"===========================================")
//                     }
//                 }
//                 switch (newbody[i].name) {
//                     case "Bitcoin":
//                         newbody[i].img = path + "/bitcoin.png";
//                         break;
//                     case "Ethereum":
//                         newbody[i].img = path + "/ethereum.png";
//                         break;
//                     case "Ripple":
//                         newbody[i].img = path + "/ripple.png";
//                         break;
//                     case "Bitcoin Cash":
//                         newbody[i].img = path + "/bitcoincash.png";
//                         break;
//                     case "EOS":
//                         newbody[i].img = path + "/eos.png";
//                         break;
//                     case "Litecoin":
//                         newbody[i].img = path + "/litecoin.png";
//                         break;
//                     case "Cardano":
//                         newbody[i].img = path + "/cardano.png";
//                         break;
//                     case "Stellar":
//                         newbody[i].img = path + "/stellar.png";
//                         break;
//                     case "IOTA":
//                         newbody[i].img = path + "/iota.png";
//                         break;
//                     case "NEO":
//                         newbody[i].img = path + "/neo.png";
//                         break;
//                     case "TRON":
//                         newbody[i].img = path + "/tron.png";
//                         break;
//                     case "Monero":
//                         newbody[i].img = path + "/monero.png";
//                         break;
//                     case "Dash":
//                         newbody[i].img = path + "/dash.png";
//                         break;
//                     case "NEM":
//                         newbody[i].img = path + "/nem.png";
//                         break;
//                     case "Tether":
//                         newbody[i].img = path + "/tether.png";
//                         break;
//                     case "OmiseGO":
//                         newbody[i].img = path + "/OmiseGO.png";
//                         break;
//                     case "VeChain":
//                         newbody[i].img = path + "/VeChain.png";
//                         break;
//                     case "Ethereum Classic":
//                         newbody[i].img = path + "/ethereumClassic.png";
//                         break;
//                     case "Qtum":
//                         newbody[i].img = path + "/qtum.png";
//                         break;
//                     case "Binance Coin":
//                         newbody[i].img = path + "/binanceCoin.png";
//                         break;
//                     case "ICON":
//                         newbody[i].img = path + "/icon.png";
//                         break;
//                     case "Bitcoin Gold":
//                         newbody[i].img = path + "/bitcoin_gold.png";
//                         break;
//                     case "Lisk":
//                         newbody[i].img = path + "/lisk.png";
//                         break;
//                     case "Zcash":
//                         newbody[i].img = path + "/zcash.png";
//                         break;
//                     case "Verge":
//                         newbody[i].img = path + "/Verge.png";
//                         break;
//                     case "Steem":
//                         newbody[i].img = path + "/steem.png";
//                         break;
//                     case "Bytom":
//                         newbody[i].img = path + "/Bytom.png";
//                         break;
//                     case "Bitcoin Private":
//                         newbody[i].img = path + "/BitcoinPrivate.png";
//                         break;
//                     case "Nano":
//                         newbody[i].img = path + "/nano.png";
//                         break;
//                     case "Bytecoin":
//                         newbody[i].img = path + "/bytcoin.png";
//                         break;
//                     case "Populous":
//                         newbody[i].img = path + "/Populous.png";
//                         break;
//                     case "Wanchain":
//                         newbody[i].img = path + "/Wanchain.png";
//                         break;
//                     case "Siacoin":
//                         newbody[i].img = path + "/siacoin.png";
//                         break;
//                     case "BitShares":
//                         newbody[i].img = path + "/BitShares.png";
//                         break;
//                     case "Bitcoin Diamond":
//                         newbody[i].img = path + "/bitcoin_diamond.png";
//                         break;
//                     case "Zilliqa":
//                         newbody[i].img = path + "/Zilliqa.png";
//                         break;
//                     case "Ontology":
//                         newbody[i].img = path + "/ontology.png";
//                         break;
//                     case "Aeternity":
//                         newbody[i].img = path + "/Aeternity.png";
//                         break;
//                     case "Maker":
//                         newbody[i].img = path + "/maker.png";
//                         break;
//                     case "Dogecoin":
//                         newbody[i].img = path + "/dogecoin.png";
//                         break;
//                     case "Decred":
//                         newbody[i].img = path + "/Decred.png";
//                         break;
//                     case "Stratis":
//                         newbody[i].img = path + "/Stratis.png";
//                         break;
//                     case "0x":
//                         newbody[i].img = path + "/0x.png";
//                         break;
//                     case "Mixin":
//                         newbody[i].img = path + "/Mixin.png";
//                         break;
//                     case "DigixDAO":
//                         newbody[i].img = path + "/DigixDAO.png";
//                         break;
//                     case "Waves":
//                         newbody[i].img = path + "/waves.png";
//                         break;
//                     case "RChain":
//                         newbody[i].img = path + "/RChain.png";
//                         break;
//                     case "Status":
//                         newbody[i].img = path + "/Status.png";
//                         break;
//                     case "Aion":
//                         newbody[i].img = path + "/Aion.png";
//                         break;
//                     case "Golem":
//                         newbody[i].img = path + "/Golem.png";
//                         break;
//                     case "Augur":
//                         newbody[i].img = path + "/Augur.png";
//                         break;
//                     case "Loopring":
//                         newbody[i].img = path + "/Loopring.png";
//                         break;
//                     case "Basic Attention Token":
//                         newbody[i].img = path + "/BasicAttentionToken.png";
//                         break;
//                     case "Kyber Network":
//                         newbody[i].img = path + "/kyber_network.png";
//                         break;
//                     case "Hshare":
//                         newbody[i].img = path + "/Hshare.png";
//                         break;
//                     case "Waltonchain":
//                         newbody[i].img = path + "/Waltonchain.png";
//                         break;
//                     case "IOST":
//                         newbody[i].img = path + "/io_stoken.png";
//                         break;
//                     case "Komodo":
//                         newbody[i].img = path + "/komodo.png";
//                         break;
//                     case "Ardor":
//                         newbody[i].img = path + "/Ardor.png";
//                         break;
//                     case "DigiByte":
//                         newbody[i].img = path + "/digibyte.png";
//                         break;
//                     case "KuCoin Shares":
//                         newbody[i].img = path + "/KuCoinShares.png";
//                         break;
//                     case "Ark":
//                         newbody[i].img = path + "/Ark.png";
//                         break;
//                     case "Centrality":
//                         newbody[i].img = path + "/Centrality.png";
//                         break;
//                     case "PIVX":
//                         newbody[i].img = path + "/pivx.png";
//                         break;
//                     case "Syscoin":
//                         newbody[i].img = path + "/syscoin.png";
//                         break;
//                     case "Mithril":
//                         newbody[i].img = path + "/mithiril.png";
//                         break;
//                     case "Substratum":
//                         newbody[i].img = path + "/substratum.png";
//                         break;
//                     case "aelf":
//                         newbody[i].img = path + "/aelf.png";
//                         break;
//                     case "MonaCoin":
//                         newbody[i].img = path + "/MonaCoin.png";
//                         break;
//                     case "Cryptonex":
//                         newbody[i].img = path + "/Cryptonex.png";
//                         break;
//                     case "Dragonchain":
//                         newbody[i].img = path + "/Dragonchain.png";
//                         break;
//                     case "Storm":
//                         newbody[i].img = path + "/strom.png";
//                         break;
//                     case "Gas":
//                         newbody[i].img = path + "/Gas.png";
//                         break;
//                     case "QASH":
//                         newbody[i].img = path + "/QASH.png";
//                         break;
//                     case "Dentacoin":
//                         newbody[i].img = path + "/dentacoin.png";
//                         break;
//                     case "Ethos":
//                         newbody[i].img = path + "/ethos.png";
//                         break;
//                     case "Factom":
//                         newbody[i].img = path + "/Factom.png";
//                         break;
//                     case "Pundi X":
//                         newbody[i].img = path + "/pundi.png";
//                         break;
//                     case "Nebulas":
//                         newbody[i].img = path + "/Nebulas.png";
//                         break;
//                     case "Cortex":
//                         newbody[i].img = path + "/Cortex.png";
//                         break;
//                     case "Veritaseum":
//                         newbody[i].img = path + "/Veritaseum.png";
//                         break;
//                     case "Bancor":
//                         newbody[i].img = path + "/bancor.png";
//                         break;
//                     case "ReddCoin":
//                         newbody[i].img = path + "/reddcoin.png";
//                         break;
//                     case "FunFair":
//                         newbody[i].img = path + "/FunFair.png";
//                         break;
//                     case "GXChain":
//                         newbody[i].img = path + "/gxchain.png";
//                         break;
//                     case "Elastos":
//                         newbody[i].img = path + "/elastos.png";
//                         break;
//                     case "SALT":
//                         newbody[i].img = path + "/salt.png";
//                         break;
//                     case "ZCoin":
//                         newbody[i].img = path + "/zcoin.png";
//                         break;
//                     case "Nxt":
//                         newbody[i].img = path + "/nxt.png";
//                         break;
//                     case "WAX":
//                         newbody[i].img = path + "/WAX.png";
//                         break;
//                     case "Kin":
//                         newbody[i].img = path + "/kin.png";
//                         break;
//                     case "Power Ledger":
//                         newbody[i].img = path + "/power_ledger.png";
//                         break;
//                     case "Monaco":
//                         newbody[i].img = path + "/Monaco.png";
//                         break;
//                     case "Revain":
//                         newbody[i].img = path + "/Revain.png";
//                         break;
//                     case "Enigma":
//                         newbody[i].img = path + "/enigma.png";
//                         break;
//                     case "Electroneum":
//                         newbody[i].img = path + "/Electroneum.png";
//                         break;
//                     case "Byteball Bytes":
//                         newbody[i].img = path + "/byteball_bytes.png";
//                         break;
//                     case "Nucleus Vision":
//                         newbody[i].img = path + "/nucleus_vision.png";
//                         break;
//                     case "MaidSafeCoin":
//                         newbody[i].img = path + "/maid_safe.png";
//                         break;
//                     case "ChainLink":
//                         newbody[i].img = path + "/chain_link.png";
//                         break;
//                     case "Gifto":
//                         newbody[i].img = path + "/Gifto.png";
//                         break;
//                     case "CyberMiles":
//                         newbody[i].img = path + "/CyberMiles.png";
//                         break;
//                     case "Fusion":
//                         newbody[i].img = path + "/Fusion.png";
//                         break;
//                     case "Huobi Token":
//                         newbody[i].img = path + "/huobiToken.png";
//                         break;
//                     case "Loom Network":
//                         newbody[i].img = path + "/loomNetwork.png";
//                         break;
//                     case "MOAC":
//                         newbody[i].img = path + "/moac.png";
//                         break;
//                     case "Skycoin":
//                         newbody[i].img = path + "/skycoin.png";
//                         break;
//                     case "Theta Token":
//                         newbody[i].img = path + "/ThetaToken.png";
//                         break;
//                     case "Nuls":
//                         newbody[i].img = path + "/nuls.png";
//                         break;
//                     default:
//                         newbody[i].img = path + "/default_coin.png";
//                 }
//             }
//             if (newbody) {
//                 for (var i = 0; i < newbody.length; i++) {
//                     Controller.coinMarketController.Update({
//                         "symbol": newbody[i].symbol
//                     }, newbody[i], function (err, data) {
//                         if (err) {
//                             return err.message
//                         } else {
//                             console.log(data);
//                         }
//                     })

//                 }

//             } else {
//                 console.log("NO response from api")
//                 return;
//             }
//             if (err) {
//                 res.status(400).send({
//                     "Status": "0",
//                     "Message": err
//                 });
//                 return;
//             } else {
//                 res.status(200).send({
//                     "Status": "1",
//                     "Message": "Updated Succesfully",
//                     "data": newbody
//                 });
//             }
//         });
//     });
// })
//                     case "Cardano":
//                         newbody[i].img = path + "/cardano.png";
//                         break;
//                     case "Stellar":
//                         newbody[i].img = path + "/stellar.png";
//                         break;
//                     case "IOTA":
//                         newbody[i].img = path + "/iota.png";
//                         break;
//                     case "NEO":
//                         newbody[i].img = path + "/neo.png";
//                         break;
//                     case "TRON":
//                         newbody[i].img = path + "/tron.png";
//                         break;
//                     case "Monero":
//                         newbody[i].img = path + "/monero.png";
//                         break;
//                     case "Dash":
//                         newbody[i].img = path + "/dash.png";
//                         break;
//                     case "NEM":
//                         newbody[i].img = path + "/nem.png";
//                         break;
//                     case "Tether":
//                         newbody[i].img = path + "/tether.png";
//                         break;
//                     case "OmiseGO":
//                         newbody[i].img = path + "/OmiseGO.png";
//                         break;
//                     case "VeChain":
//                         newbody[i].img = path + "/VeChain.png";
//                         break;
//                     case "Ethereum Classic":
//                         newbody[i].img = path + "/ethereumClassic.png";
//                         break;
//                     case "Qtum":
//                         newbody[i].img = path + "/qtum.png";
//                         break;
//                     case "Binance Coin":
//                         newbody[i].img = path + "/binanceCoin.png";
//                         break;
//                     case "ICON":
//                         newbody[i].img = path + "/icon.png";
//                         break;
//                     case "Bitcoin Gold":
//                         newbody[i].img = path + "/bitcoin_gold.png";
//                         break;
//                     case "Lisk":
//                         newbody[i].img = path + "/lisk.png";
//                         break;
//                     case "Zcash":
//                         newbody[i].img = path + "/zcash.png";
//                         break;
//                     case "Verge":
//                         newbody[i].img = path + "/Verge.png";
//                         break;
//                     case "Steem":
//                         newbody[i].img = path + "/steem.png";
//                         break;
//                     case "Bytom":
//                         newbody[i].img = path + "/Bytom.png";
//                         break;
//                     case "Bitcoin Private":
//                         newbody[i].img = path + "/BitcoinPrivate.png";
//                         break;
//                     case "Nano":
//                         newbody[i].img = path + "/nano.png";
//                         break;
//                     case "Bytecoin":
//                         newbody[i].img = path + "/bytcoin.png";
//                         break;
//                     case "Populous":
//                         newbody[i].img = path + "/Populous.png";
//                         break;
//                     case "Wanchain":
//                         newbody[i].img = path + "/Wanchain.png";
//                         break;
//                     case "Siacoin":
//                         newbody[i].img = path + "/siacoin.png";
//                         break;
//                     case "BitShares":
//                         newbody[i].img = path + "/BitShares.png";
//                         break;
//                     case "Bitcoin Diamond":
//                         newbody[i].img = path + "/bitcoin_diamond.png";
//                         break;
//                     case "Zilliqa":
//                         newbody[i].img = path + "/Zilliqa.png";
//                         break;
//                     case "Ontology":
//                         newbody[i].img = path + "/ontology.png";
//                         break;
//                     case "Aeternity":
//                         newbody[i].img = path + "/Aeternity.png";
//                         break;
//                     case "Maker":
//                         newbody[i].img = path + "/maker.png";
//                         break;
//                     case "Dogecoin":
//                         newbody[i].img = path + "/dogecoin.png";
//                         break;
//                     case "Decred":
//                         newbody[i].img = path + "/Decred.png";
//                         break;
//                     case "Stratis":
//                         newbody[i].img = path + "/Stratis.png";
//                         break;
//                     case "0x":
//                         newbody[i].img = path + "/0x.png";
//                         break;
//                     case "Mixin":
//                         newbody[i].img = path + "/Mixin.png";
//                         break;
//                     case "DigixDAO":
//                         newbody[i].img = path + "/DigixDAO.png";
//                         break;
//                     case "Waves":
//                         newbody[i].img = path + "/waves.png";
//                         break;
//                     case "RChain":
//                         newbody[i].img = path + "/RChain.png";
//                         break;
//                     case "Status":
//                         newbody[i].img = path + "/Status.png";
//                         break;
//                     case "Aion":
//                         newbody[i].img = path + "/Aion.png";
//                         break;
//                     case "Golem":
//                         newbody[i].img = path + "/Golem.png";
//                         break;
//                     case "Augur":
//                         newbody[i].img = path + "/Augur.png";
//                         break;
//                     case "Loopring":
//                         newbody[i].img = path + "/Loopring.png";
//                         break;
//                     case "Basic Attention Token":
//                         newbody[i].img = path + "/BasicAttentionToken.png";
//                         break;
//                     case "Kyber Network":
//                         newbody[i].img = path + "/kyber_network.png";
//                         break;
//                     case "Hshare":
//                         newbody[i].img = path + "/Hshare.png";
//                         break;
//                     case "Waltonchain":
//                         newbody[i].img = path + "/Waltonchain.png";
//                         break;
//                     case "IOST":
//                         newbody[i].img = path + "/io_stoken.png";
//                         break;
//                     case "Komodo":
//                         newbody[i].img = path + "/komodo.png";
//                         break;
//                     case "Ardor":
//                         newbody[i].img = path + "/Ardor.png";
//                         break;
//                     case "DigiByte":
//                         newbody[i].img = path + "/digibyte.png";
//                         break;
//                     case "KuCoin Shares":
//                         newbody[i].img = path + "/KuCoinShares.png";
//                         break;
//                     case "Ark":
//                         newbody[i].img = path + "/Ark.png";
//                         break;
//                     case "Centrality":
//                         newbody[i].img = path + "/Centrality.png";
//                         break;
//                     case "PIVX":
//                         newbody[i].img = path + "/pivx.png";
//                         break;
//                     case "Syscoin":
//                         newbody[i].img = path + "/syscoin.png";
//                         break;
//                     case "Mithril":
//                         newbody[i].img = path + "/mithiril.png";
//                         break;
//                     case "Substratum":
//                         newbody[i].img = path + "/substratum.png";
//                         break;
//                     case "aelf":
//                         newbody[i].img = path + "/aelf.png";
//                         break;
//                     case "MonaCoin":
//                         newbody[i].img = path + "/MonaCoin.png";
//                         break;
//                     case "Cryptonex":
//                         newbody[i].img = path + "/Cryptonex.png";
//                         break;
//                     case "Dragonchain":
//                         newbody[i].img = path + "/Dragonchain.png";
//                         break;
//                     case "Storm":
//                         newbody[i].img = path + "/strom.png";
//                         break;
//                     case "Gas":
//                         newbody[i].img = path + "/Gas.png";
//                         break;
//                     case "QASH":
//                         newbody[i].img = path + "/QASH.png";
//                         break;
//                     case "Dentacoin":
//                         newbody[i].img = path + "/dentacoin.png";
//                         break;
//                     case "Ethos":
//                         newbody[i].img = path + "/ethos.png";
//                         break;
//                     case "Factom":
//                         newbody[i].img = path + "/Factom.png";
//                         break;
//                     case "Pundi X":
//                         newbody[i].img = path + "/pundi.png";
//                         break;
//                     case "Nebulas":
//                         newbody[i].img = path + "/Nebulas.png";
//                         break;
//                     case "Cortex":
//                         newbody[i].img = path + "/Cortex.png";
//                         break;
//                     case "Veritaseum":
//                         newbody[i].img = path + "/Veritaseum.png";
//                         break;
//                     case "Bancor":
//                         newbody[i].img = path + "/bancor.png";
//                         break;
//                     case "ReddCoin":
//                         newbody[i].img = path + "/reddcoin.png";
//                         break;
//                     case "FunFair":
//                         newbody[i].img = path + "/FunFair.png";
//                         break;
//                     case "GXChain":
//                         newbody[i].img = path + "/gxchain.png";
//                         break;
//                     case "Elastos":
//                         newbody[i].img = path + "/elastos.png";
//                         break;
//                     case "SALT":
//                         newbody[i].img = path + "/salt.png";
//                         break;
//                     case "ZCoin":
//                         newbody[i].img = path + "/zcoin.png";
//                         break;
//                     case "Nxt":
//                         newbody[i].img = path + "/nxt.png";
//                         break;
//                     case "WAX":
//                         newbody[i].img = path + "/WAX.png";
//                         break;
//                     case "Kin":
//                         newbody[i].img = path + "/kin.png";
//                         break;
//                     case "Power Ledger":
//                         newbody[i].img = path + "/power_ledger.png";
//                         break;
//                     case "Monaco":
//                         newbody[i].img = path + "/Monaco.png";
//                         break;
//                     case "Revain":
//                         newbody[i].img = path + "/Revain.png";
//                         break;
//                     case "Enigma":
//                         newbody[i].img = path + "/enigma.png";
//                         break;
//                     case "Electroneum":
//                         newbody[i].img = path + "/Electroneum.png";
//                         break;
//                     case "Byteball Bytes  // app.route('/updateData').get((req, res) => {
//     Controller.coinMarketController.findDetail(function (err, data) {
//         if (err) {
//             return err.Message;
//         } else {
//             //console.log(data, "====================================================================data")
//             recievedDetails = data;
//             //console.log(recievedDetails,"(((((((((((((((((((((((((((((((((")
//             return recievedDetails;
//         }
//     })
//     Controller.adminController.viewAdminData(function (err, data) {
//         console.log(err, data)
//         if (err) {
//             return err.Message;
//         } else {
//             // console.log(data, "====================================================================data")
//             recievedAdminData = data;
//             return recievedAdminData;
//         }
//     });
//     request(Config.URL.liveRateURL, function (err, resp, body) {
//         if (err) {
//             return err.Message;
//         }
//         var newbody = JSON.parse(body);
//         for (var i = 0; i < newbody.length; i++) {
//             if (newbody[i].symbol == "ETH") {
//                 ETHfactor = (1 / newbody[i].price_usd);
//             }
//         }
//         request(Config.URL.conversionURL, function (err, respns, convertedbody) {
//             if (err) {
//                 return err.Message;
//             }
//             convertedRates = JSON.parse(convertedbody);
//             for (var i = 0; i < newbody.length; i++) {
//                 if (newbody[i].max_supply == null) {
//                     newbody[i].max_supply = "";
//                 }
//                 // Controller.walletController.updateWalletDetails(newbody[i].symbol,newbody[i].name,function(err,data){
//                 //     if(err){
//                 //         return err.message;
//                 //     }
//                 // })
//                 newbody[i].difference = "0";
//                 newbody[i].price_inr = (newbody[i].price_usd * convertedRates.rates.INR).toFixed(2);
//                 newbody[i].price_eth = (newbody[i].price_usd * ETHfactor).toFixed(6);
//                 newbody[i].sellrate_INR = newbody[i].price_inr;
//                 newbody[i].sellrate_USD = newbody[i].price_usd;
//                 newbody[i].sellrate_ETH = newbody[i].price_eth;
//                 newbody[i].sellrate_BTC = newbody[i].price_btc;
//                 if (recievedAdminData) {
//                     // console.log(recievedAdminData, "======================================================recievedAdminData")
//                     for (var j = 0; j < recievedAdminData.length; j++) {
//                         if (recievedAdminData[j].currencysymbol == newbody[i].symbol) {
//                             newbody[i].price_inr = (newbody[i].price_inr * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_usd = (newbody[i].price_usd * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_INR = (newbody[i].price_inr * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_USD = (newbody[i].price_usd * recievedAdminData[j].sellrate).toString();
//                             newbody[i].price_eth = (newbody[i].price_eth * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_btc = (newbody[i].price_btc * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_ETH = (newbody[i].price_eth * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_BTC = (newbody[i].price_btc * recievedAdminData[j].sellrate).toString();
//                             newbody[i].fees = recievedAdminData[j].fees;
//                             newbody[i].gst = recievedAdminData[j].gst;
//                         }
//                     }
//                 }
//                 for (var j = 0; j < recievedDetails.length; j++) {
//                     if (recievedDetails[j].symbol == newbody[i].symbol) {
//                         newbody[i].difference = (recievedDetails[j].percent_change_24h - newbody[i].percent_change_24h).toString();
//                         // console.log(newbody[i].percent_change_24h,"===========================================")
//                     }
//                 }
//                 switch (newbody[i].name) {
//                     case "Bitcoin":
//                         newbody[i].img = path + "/bitcoin.png";
//                         break;
//                     case "Ethereum":
//                         newbody[i].img = path + "/ethereum.png";
//                         break;
//                     case "Ripple":
//                         newbody[i].img = path + "/ripple.png";
//                         break;
//                     case "Bitcoin Cash":
//                         newbody[i].img = path + "/bitcoincash.png";
//                         break;
//                     case "EOS":
//                         newbody[i].img = path + "/eos.png";
//                         break;
//                     case "Litecoin":
//                         newbody[i].img = path + "/litecoin.png";
//                         break;
//                     case "Cardano":
//                         newbody[i].img = path + "/cardano.png";
//                         break;
//                     case "Stellar":
//                         newbody[i].img = path + "/stellar.png";
//                         break;
//                     case "IOTA":
//                         newbody[i].img = path + "/iota.png";
//                         break;
//                     case "NEO":
//                         newbody[i].img = path + "/neo.png";
//                         break;
//                     case "TRON":
//                         newbody[i].img = path + "/tron.png";
//                         break;
//                     case "Monero":
//                         newbody[i].img = path + "/monero.png";
//                         break;
//                     case "Dash":
//                         newbody[i].img = path + "/dash.png";
//                         break;
//                     case "NEM":
//                         newbody[i].img = path + "/nem.png";
//                         break;
//                     case "Tether":
//                         newbody[i].img = path + "/tether.png";
//                         break;
//                     case "OmiseGO":
//                         newbody[i].img = path + "/OmiseGO.png";
//                         break;
//                     case "VeChain":
//                         newbody[i].img = path + "/VeChain.png";
//                         break;
//                     case "Ethereum Classic":
//                         newbody[i].img = path + "/ethereumClassic.png";
//                         break;
//                     case "Qtum":
//                         newbody[i].img = path + "/qtum.png";
//                         break;
//                     case "Binance Coin":
//                         newbody[i].img = path + "/binanceCoin.png";
//                         break;
//                     case "ICON":
//                         newbody[i].img = path + "/icon.png";
//                         break;
//                     case "Bitcoin Gold":
//                         newbody[i].img = path + "/bitcoin_gold.png";
//                         break;
//                     case "Lisk":
//                         newbody[i].img = path + "/lisk.png";
//                         break;
//                     case "Zcash":
//                         newbody[i].img = path + "/zcash.png";
//                         break;
//                     case "Verge":
//                         newbody[i].img = path + "/Verge.png";
//                         break;
//                     case "Steem":
//                         newbody[i].img = path + "/steem.png";
//                         break;
//                     case "Bytom":
//                         newbody[i].img = path + "/Bytom.png";
//                         break;
//                     case "Bitcoin Private":
//                         newbody[i].img = path + "/BitcoinPrivate.png";
//                         break;
//                     case "Nano":
//                         newbody[i].img = path + "/nano.png";
//                         break;
//                     case "Bytecoin":
//                         newbody[i].img = path + "/bytcoin.png";
//                         break;
//                     case "Populous":
//                         newbody[i].img = path + "/Populous.png";
//                         break;
//                     case "Wanchain":
//                         newbody[i].img = path + "/Wanchain.png";
//                         break;
//                     case "Siacoin":
//                         newbody[i].img = path + "/siacoin.png";
//                         break;
//                     case "BitShares":
//                         newbody[i].img = path + "/BitShares.png";
//                         break;
//                     case "Bitcoin Diamond":
//                         newbody[i].img = path + "/bitcoin_diamond.png";
//                         break;
//                     case "Zilliqa":
//                         newbody[i].img = path + "/Zilliqa.png";
//                         break;
//                     case "Ontology":
//                         newbody[i].img = path + "/ontology.png";
//                         break;
//                     case "Aeternity":
//                         newbody[i].img = path + "/Aeternity.png";
//                         break;
//                     case "Maker":
//                         newbody[i].img = path + "/maker.png";
//                         break;
//                     case "Dogecoin":
//                         newbody[i].img = path + "/dogecoin.png";
//                         break;
//                     case "Decred":
//                         newbody[i].img = path + "/Decred.png";
//                         break;
//                     case "Stratis":
//                         newbody[i].img = path + "/Stratis.png";
//                         break;
//                     case "0x":
//                         newbody[i].img = path + "/0x.png";
//                         break;
//                     case "Mixin":
//                         newbody[i].img = path + "/Mixin.png";
//                         break;
//                     case "DigixDAO":
//                         newbody[i].img = path + "/DigixDAO.png";
//                         break;
//                     case "Waves":
//                         newbody[i].img = path + "/waves.png";
//                         break;
//                     case "RChain":
//                         newbody[i].img = path + "/RChain.png";
//                         break;
//                     case "Status":
//                         newbody[i].img = path + "/Status.png";
//                         break;
//                     case "Aion":
//                         newbody[i].img = path + "/Aion.png";
//                         break;
//                     case "Golem":
//                         newbody[i].img = path + "/Golem.png";
//                         break;
//                     case "Augur":
//                         newbody[i].img = path + "/Augur.png";
//                         break;
//                     case "Loopring":
//                         newbody[i].img = path + "/Loopring.png";
//                         break;
//                     case "Basic Attention Token":
//                         newbody[i].img = path + "/BasicAttentionToken.png";
//                         break;
//                     case "Kyber Network":
//                         newbody[i].img = path + "/kyber_network.png";
//                         break;
//                     case "Hshare":
//                         newbody[i].img = path + "/Hshare.png";
//                         break;
//                     case "Waltonchain":
//                         newbody[i].img = path + "/Waltonchain.png";
//                         break;
//                     case "IOST":
//                         newbody[i].img = path + "/io_stoken.png";
//                         break;
//                     case "Komodo":
//                         newbody[i].img = path + "/komodo.png";
//                         break;
//                     case "Ardor":
//                         newbody[i].img = path + "/Ardor.png";
//                         break;
//                     case "DigiByte":
//                         newbody[i].img = path + "/digibyte.png";
//                         break;
//                     case "KuCoin Shares":
//                         newbody[i].img = path + "/KuCoinShares.png";
//                         break;
//                     case "Ark":
//                         newbody[i].img = path + "/Ark.png";
//                         break;
//                     case "Centrality":
//                         newbody[i].img = path + "/Centrality.png";
//                         break;
//                     case "PIVX":
//                         newbody[i].img = path + "/pivx.png";
//                         break;
//                     case "Syscoin":
//                         newbody[i].img = path + "/syscoin.png";
//                         break;
//                     case "Mithril":
//                         newbody[i].img = path + "/mithiril.png";
//                         break;
//                     case "Substratum":
//                         newbody[i].img = path + "/substratum.png";
//                         break;
//                     case "aelf":
//                         newbody[i].img = path + "/aelf.png";
//                         break;
//                     case "MonaCoin":
//                         newbody[i].img = path + "/MonaCoin.png";
//                         break;
//                     case "Cryptonex":
//                         newbody[i].img = path + "/Cryptonex.png";
//                         break;
//                     case "Dragonchain":
//                         newbody[i].img = path + "/Dragonchain.png";
//                         break;
//                     case "Storm":
//                         newbody[i].img = path + "/strom.png";
//                         break;
//                     case "Gas":
//                         newbody[i].img = path + "/Gas.png";
//                         break;
//                     case "QASH":
//                         newbody[i].img = path + "/QASH.png";
//                         break;
//                     case "Dentacoin":
//                         newbody[i].img = path + "/dentacoin.png";
//                         break;
//                     case "Ethos":
//                         newbody[i].img = path + "/ethos.png";
//                         break;
//                     case "Factom":
//                         newbody[i].img = path + "/Factom.png";
//                         break;
//                     case "Pundi X":
//                         newbody[i].img = path + "/pundi.png";
//                         break;
//                     case "Nebulas":
//                         newbody[i].img = path + "/Nebulas.png";
//                         break;
//                     case "Cortex":
//                         newbody[i].img = path + "/Cortex.png";
//                         break;
//                     case "Veritaseum":
//                         newbody[i].img = path + "/Veritaseum.png";
//                         break;
//                     case "Bancor":
//                         newbody[i].img = path + "/bancor.png";
//                         break;
//                     case "ReddCoin":
//                         newbody[i].img = path + "/reddcoin.png";
//                         break;
//                     case "FunFair":
//                         newbody[i].img = path + "/FunFair.png";
//                         break;
//                     case "GXChain":
//                         newbody[i].img = path + "/gxchain.png";
//                         break;
//                     case "Elastos":
//                         newbody[i].img = path + "/elastos.png";
//                         break;
//                     case "SALT":
//                         newbody[i].img = path + "/salt.png";
//                         break;
//                     case "ZCoin":
//                         newbody[i].img = path + "/zcoin.png";
//                         break;
//                     case "Nxt":
//                         newbody[i].img = path + "/nxt.png";
//                         break;
//                     case "WAX":
//                         newbody[i].img = path + "/WAX.png";
//                         break;
//                     case "Kin":
//                         newbody[i].img = path + "/kin.png";
//                         break;
//                     case "Power Ledger":
//                         newbody[i].img = path + "/power_ledger.png";
//                         break;
//                     case "Monaco":
//                         newbody[i].img = path + "/Monaco.png";
//                         break;
//                     case "Revain":
//                         newbody[i].img = path + "/Revain.png";
//                         break;
//                     case "Enigma":
//                         newbody[i].img = path + "/enigma.png";
//                         break;
//                     case "Electroneum":
//                         newbody[i].img = path + "/Electroneum.png";
//                         break;
//                     case "Byteball Bytes":
//                         newbody[i].img = path + "/byteball_bytes.png";
//                         break;
//                     case "Nucleus Vision":
//                         newbody[i].img = path + "/nucleus_vision.png";
//                         break;
//                     case "MaidSafeCoin":
//                         newbody[i].img = path + "/maid_safe.png";
//                         break;
//                     case "ChainLink":
//                         newbody[i].img = path + "/chain_link.png";
//                         break;
//                     case "Gifto":
//                         newbody[i].img = path + "/Gifto.png";
//                         break;
//                     case "CyberMiles":
//                         newbody[i].img = path + "/CyberMiles.png";
//                         break;
//                     case "Fusion":
//                         newbody[i].img = path + "/Fusion.png";
//                         break;
//                     case "Huobi Token":
//                         newbody[i].img = path + "/huobiToken.png";
//                         break;
//                     case "Loom Network":
//                         newbody[i].img = path + "/loomNetwork.png";
//                         break;
//                     case "MOAC":
//                         newbody[i].img = path + "/moac.png";
//                         break;
//                     case "Skycoin":
//                         newbody[i].img = path + "/skycoin.png";
//                         break;
//                     case "Theta Token":
//                         newbody[i].img = path + "/ThetaToken.png";
//                         break;
//                     case "Nuls":
//                         newbody[i].img = path + "/nuls.png";
//                         break;
//                     default:
//                         newbody[i].img = path + "/default_coin.png";
//                 }
//             }
//             if (newbody) {
//                 for (var i = 0; i < newbody.length; i++) {
//                     Controller.coinMarketController.Update({
//                         "symbol": newbody[i].symbol
//                     }, newbody[i], function (err, data) {
//                         if (err) {
//                             return err.message
//                         } else {
//                             console.log(data);
//                         }
//                     })

//                 }

//             } else {
//                 console.log("NO response from api")
//                 return;
//             }
//             if (err) {
//                 res.status(400).send({
//                     "Status": "0",
//                     "Message": err
//                 });
//                 return;
//             } else {
//                 res.status(200).send({
//                     "Status": "1",
//                     "Message": "Updated Succesfully",
//                     "data": newbody
//                 });
//             }
//         });
//     });
// }):
//                         newbody[i].img =  // app.route('/updateData').get((req, res) => {
//     Controller.coinMarketController.findDetail(function (err, data) {
//         if (err) {
//             return err.Message;
//         } else {
//             //console.log(data, "====================================================================data")
//             recievedDetails = data;
//             //console.log(recievedDetails,"(((((((((((((((((((((((((((((((((")
//             return recievedDetails;
//         }
//     })
//     Controller.adminController.viewAdminData(function (err, data) {
//         console.log(err, data)
//         if (err) {
//             return err.Message;
//         } else {
//             // console.log(data, "====================================================================data")
//             recievedAdminData = data;
//             return recievedAdminData;
//         }
//     });
//     request(Config.URL.liveRateURL, function (err, resp, body) {
//         if (err) {
//             return err.Message;
//         }
//         var newbody = JSON.parse(body);
//         for (var i = 0; i < newbody.length; i++) {
//             if (newbody[i].symbol == "ETH") {
//                 ETHfactor = (1 / newbody[i].price_usd);
//             }
//         }
//         request(Config.URL.conversionURL, function (err, respns, convertedbody) {
//             if (err) {
//                 return err.Message;
//             }
//             convertedRates = JSON.parse(convertedbody);
//             for (var i = 0; i < newbody.length; i++) {
//                 if (newbody[i].max_supply == null) {
//                     newbody[i].max_supply = "";
//                 }
//                 // Controller.walletController.updateWalletDetails(newbody[i].symbol,newbody[i].name,function(err,data){
//                 //     if(err){
//                 //         return err.message;
//                 //     }
//                 // })
//                 newbody[i].difference = "0";
//                 newbody[i].price_inr = (newbody[i].price_usd * convertedRates.rates.INR).toFixed(2);
//                 newbody[i].price_eth = (newbody[i].price_usd * ETHfactor).toFixed(6);
//                 newbody[i].sellrate_INR = newbody[i].price_inr;
//                 newbody[i].sellrate_USD = newbody[i].price_usd;
//                 newbody[i].sellrate_ETH = newbody[i].price_eth;
//                 newbody[i].sellrate_BTC = newbody[i].price_btc;
//                 if (recievedAdminData) {
//                     // console.log(recievedAdminData, "======================================================recievedAdminData")
//                     for (var j = 0; j < recievedAdminData.length; j++) {
//                         if (recievedAdminData[j].currencysymbol == newbody[i].symbol) {
//                             newbody[i].price_inr = (newbody[i].price_inr * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_usd = (newbody[i].price_usd * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_INR = (newbody[i].price_inr * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_USD = (newbody[i].price_usd * recievedAdminData[j].sellrate).toString();
//                             newbody[i].price_eth = (newbody[i].price_eth * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_btc = (newbody[i].price_btc * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_ETH = (newbody[i].price_eth * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_BTC = (newbody[i].price_btc * recievedAdminData[j].sellrate).toString();
//                             newbody[i].fees = recievedAdminData[j].fees;
//                             newbody[i].gst = recievedAdminData[j].gst;
//                         }
//                     }
//                 }
//                 for (var j = 0; j < recievedDetails.length; j++) {
//                     if (recievedDetails[j].symbol == newbody[i].symbol) {
//                         newbody[i].difference = (recievedDetails[j].percent_change_24h - newbody[i].percent_change_24h).toString();
//                         // console.log(newbody[i].percent_change_24h,"===========================================")
//                     }
//                 }
//                 switch (newbody[i].name) {
//                     case "Bitcoin":
//                         newbody[i].img = path + "/bitcoin.png";
//                         break;
//                     case "Ethereum":
//                         newbody[i].img = path + "/ethereum.png";
//                         break;
//                     case "Ripple":
//                         newbody[i].img = path + "/ripple.png";
//                         break;
//                     case "Bitcoin Cash":
//                         newbody[i].img = path + "/bitcoincash.png";
//                         break;
//                     case "EOS":
//                         newbody[i].img = path + "/eos.png";
//                         break;
//                     case "Litecoin":
//                         newbody[i].img = path + "/litecoin.png";
//                         break;
//                     case "Cardano":
//                         newbody[i].img = path + "/cardano.png";
//                         break;
//                     case "Stellar":
//                         newbody[i].img = path + "/stellar.png";
//                         break;
//                     case "IOTA":
//                         newbody[i].img = path + "/iota.png";
//                         break;
//                     case "NEO":
//                         newbody[i].img = path + "/neo.png";
//                         break;
//                     case "TRON":
//                         newbody[i].img = path + "/tron.png";
//                         break;
//                     case "Monero":
//                         newbody[i].img = path + "/monero.png";
//                         break;
//                     case "Dash":
//                         newbody[i].img = path + "/dash.png";
//                         break;
//                     case "NEM":
//                         newbody[i].img = path + "/nem.png";
//                         break;
//                     case "Tether":
//                         newbody[i].img = path + "/tether.png";
//                         break;
//                     case "OmiseGO":
//                         newbody[i].img = path + "/OmiseGO.png";
//                         break;
//                     case "VeChain":
//                         newbody[i].img = path + "/VeChain.png";
//                         break;
//                     case "Ethereum Classic":
//                         newbody[i].img = path + "/ethereumClassic.png";
//                         break;
//                     case "Qtum":
//                         newbody[i].img = path + "/qtum.png";
//                         break;
//                     case "Binance Coin":
//                         newbody[i].img = path + "/binanceCoin.png";
//                         break;
//                     case "ICON":
//                         newbody[i].img = path + "/icon.png";
//                         break;
//                     case "Bitcoin Gold":
//                         newbody[i].img = path + "/bitcoin_gold.png";
//                         break;
//                     case "Lisk":
//                         newbody[i].img = path + "/lisk.png";
//                         break;
//                     case "Zcash":
//                         newbody[i].img = path + "/zcash.png";
//                         break;
//                     case "Verge":
//                         newbody[i].img = path + "/Verge.png";
//                         break;
//                     case "Steem":
//                         newbody[i].img = path + "/steem.png";
//                         break;
//                     case "Bytom":
//                         newbody[i].img = path + "/Bytom.png";
//                         break;
//                     case "Bitcoin Private":
//                         newbody[i].img = path + "/BitcoinPrivate.png";
//                         break;
//                     case "Nano":
//                         newbody[i].img = path + "/nano.png";
//                         break;
//                     case "Bytecoin":
//                         newbody[i].img = path + "/bytcoin.png";
//                         break;
//                     case "Populous":
//                         newbody[i].img = path + "/Populous.png";
//                         break;
//                     case "Wanchain":
//                         newbody[i].img = path + "/Wanchain.png";
//                         break;
//                     case "Siacoin":
//                         newbody[i].img = path + "/siacoin.png";
//                         break;
//                     case "BitShares":
//                         newbody[i].img = path + "/BitShares.png";
//                         break;
//                     case "Bitcoin Diamond":
//                         newbody[i].img = path + "/bitcoin_diamond.png";
//                         break;
//                     case "Zilliqa":
//                         newbody[i].img = path + "/Zilliqa.png";
//                         break;
//                     case "Ontology":
//                         newbody[i].img = path + "/ontology.png";
//                         break;
//                     case "Aeternity":
//                         newbody[i].img = path + "/Aeternity.png";
//                         break;
//                     case "Maker":
//                         newbody[i].img = path + "/maker.png";
//                         break;
//                     case "Dogecoin":
//                         newbody[i].img = path + "/dogecoin.png";
//                         break;
//                     case "Decred":
//                         newbody[i].img = path + "/Decred.png";
//                         break;
//                     case "Stratis":
//                         newbody[i].img = path + "/Stratis.png";
//                         break;
//                     case "0x":
//                         newbody[i].img = path + "/0x.png";
//                         break;
//                     case "Mixin":
//                         newbody[i].img = path + "/Mixin.png";
//                         break;
//                     case "DigixDAO":
//                         newbody[i].img = path + "/DigixDAO.png";
//                         break;
//                     case "Waves":
//                         newbody[i].img = path + "/waves.png";
//                         break;
//                     case "RChain":
//                         newbody[i].img = path + "/RChain.png";
//                         break;
//                     case "Status":
//                         newbody[i].img = path + "/Status.png";
//                         break;
//                     case "Aion":
//                         newbody[i].img = path + "/Aion.png";
//                         break;
//                     case "Golem":
//                         newbody[i].img = path + "/Golem.png";
//                         break;
//                     case "Augur":
//                         newbody[i].img = path + "/Augur.png";
//                         break;
//                     case "Loopring":
//                         newbody[i].img = path + "/Loopring.png";
//                         break;
//                     case "Basic Attention Token":
//                         newbody[i].img = path + "/BasicAttentionToken.png";
//                         break;
//                     case "Kyber Network":
//                         newbody[i].img = path + "/kyber_network.png";
//                         break;
//                     case "Hshare":
//                         newbody[i].img = path + "/Hshare.png";
//                         break;
//                     case "Waltonchain":
//                         newbody[i].img = path + "/Waltonchain.png";
//                         break;
//                     case "IOST":
//                         newbody[i].img = path + "/io_stoken.png";
//                         break;
//                     case "Komodo":
//                         newbody[i].img = path + "/komodo.png";
//                         break;
//                     case "Ardor":
//                         newbody[i].img = path + "/Ardor.png";
//                         break;
//                     case "DigiByte":
//                         newbody[i].img = path + "/digibyte.png";
//                         break;
//                     case "KuCoin Shares":
//                         newbody[i].img = path + "/KuCoinShares.png";
//                         break;
//                     case "Ark":
//                         newbody[i].img = path + "/Ark.png";
//                         break;
//                     case "Centrality":
//                         newbody[i].img = path + "/Centrality.png";
//                         break;
//                     case "PIVX":
//                         newbody[i].img = path + "/pivx.png";
//                         break;
//                     case "Syscoin":
//                         newbody[i].img = path + "/syscoin.png";
//                         break;
//                     case "Mithril":
//                         newbody[i].img = path + "/mithiril.png";
//                         break;
//                     case "Substratum":
//                         newbody[i].img = path + "/substratum.png";
//                         break;
//                     case "aelf":
//                         newbody[i].img = path + "/aelf.png";
//                         break;
//                     case "MonaCoin":
//                         newbody[i].img = path + "/MonaCoin.png";
//                         break;
//                     case "Cryptonex":
//                         newbody[i].img = path + "/Cryptonex.png";
//                         break;
//                     case "Dragonchain":
//                         newbody[i].img = path + "/Dragonchain.png";
//                         break;
//                     case "Storm":
//                         newbody[i].img = path + "/strom.png";
//                         break;
//                     case "Gas":
//                         newbody[i].img = path + "/Gas.png";
//                         break;
//                     case "QASH":
//                         newbody[i].img = path + "/QASH.png";
//                         break;
//                     case "Dentacoin":
//                         newbody[i].img = path + "/dentacoin.png";
//                         break;
//                     case "Ethos":
//                         newbody[i].img = path + "/ethos.png";
//                         break;
//                     case "Factom":
//                         newbody[i].img = path + "/Factom.png";
//                         break;
//                     case "Pundi X":
//                         newbody[i].img = path + "/pundi.png";
//                         break;
//                     case "Nebulas":
//                         newbody[i].img = path + "/Nebulas.png";
//                         break;
//                     case "Cortex":
//                         newbody[i].img = path + "/Cortex.png";
//                         break;
//                     case "Veritaseum":
//                         newbody[i].img = path + "/Veritaseum.png";
//                         break;
//                     case "Bancor":
//                         newbody[i].img = path + "/bancor.png";
//                         break;
//                     case "ReddCoin":
//                         newbody[i].img = path + "/reddcoin.png";
//                         break;
//                     case "FunFair":
//                         newbody[i].img = path + "/FunFair.png";
//                         break;
//                     case "GXChain":
//                         newbody[i].img = path + "/gxchain.png";
//                         break;
//                     case "Elastos":
//                         newbody[i].img = path + "/elastos.png";
//                         break;
//                     case "SALT":
//                         newbody[i].img = path + "/salt.png";
//                         break;
//                     case "ZCoin":
//                         newbody[i].img = path + "/zcoin.png";
//                         break;
//                     case "Nxt":
//                         newbody[i].img = path + "/nxt.png";
//                         break;
//                     case "WAX":
//                         newbody[i].img = path + "/WAX.png";
//                         break;
//                     case "Kin":
//                         newbody[i].img = path + "/kin.png";
//                         break;
//                     case "Power Ledger":
//                         newbody[i].img = path + "/power_ledger.png";
//                         break;
//                     case "Monaco":
//                         newbody[i].img = path + "/Monaco.png";
//                         break;
//                     case "Revain":
//                         newbody[i].img = path + "/Revain.png";
//                         break;
//                     case "Enigma":
//                         newbody[i].img = path + "/enigma.png";
//                         break;
//                     case "Electroneum":
//                         newbody[i].img = path + "/Electroneum.png";
//                         break;
//                     case "Byteball Bytes":
//                         newbody[i].img = path + "/byteball_bytes.png";
//                         break;
//                     case "Nucleus Vision":
//                         newbody[i].img = path + "/nucleus_vision.png";
//                         break;
//                     case "MaidSafeCoin":
//                         newbody[i].img = path + "/maid_safe.png";
//                         break;
//                     case "ChainLink":
//                         newbody[i].img = path + "/chain_link.png";
//                         break;
//                     case "Gifto":
//                         newbody[i].img = path + "/Gifto.png";
//                         break;
//                     case "CyberMiles":
//                         newbody[i].img = path + "/CyberMiles.png";
//                         break;
//                     case "Fusion":
//                         newbody[i].img = path + "/Fusion.png";
//                         break;
//                     case "Huobi Token":
//                         newbody[i].img = path + "/huobiToken.png";
//                         break;
//                     case "Loom Network":
//                         newbody[i].img = path + "/loomNetwork.png";
//                         break;
//                     case "MOAC":
//                         newbody[i].img = path + "/moac.png";
//                         break;
//                     case "Skycoin":
//                         newbody[i].img = path + "/skycoin.png";
//                         break;
//                     case "Theta Token":
//                         newbody[i].img = path + "/ThetaToken.png";
//                         break;
//                     case "Nuls":
//                         newbody[i].img = path + "/nuls.png";
//                         break;
//                     default:
//                         newbody[i].img = path + "/default_coin.png";
//                 }
//             }
//             if (newbody) {
//                 for (var i = 0; i < newbody.length; i++) {
//                     Controller.coinMarketController.Update({
//                         "symbol": newbody[i].symbol
//                     }, newbody[i], function (err, data) {
//                         if (err) {
//                             return err.message
//                         } else {
//                             console.log(data);
//                         }
//                     })

//                 }

//             } else {
//                 console.log("NO response from api")
//                 return;
//             }
//             if (err) {
//                 res.status(400).send({
//                     "Status": "0",
//                     "Message": err
//                 });
//                 return;
//             } else {
//                 res.status(200).send({
//                     "Status": "1",
//                     "Message": "Updated Succesfully",
//                     "data": newbody
//                 });
//             }
//         });
//     });
// })path + "/byteball_bytes.png";
//                         break;
//                     case "Nucleus Vision  // app.route('/updateData').get((req, res) => {
//     Controller.coinMarketController.findDetail(function (err, data) {
//         if (err) {
//             return err.Message;
//         } else {
//             //console.log(data, "====================================================================data")
//             recievedDetails = data;
//             //console.log(recievedDetails,"(((((((((((((((((((((((((((((((((")
//             return recievedDetails;
//         }
//     })
//     Controller.adminController.viewAdminData(function (err, data) {
//         console.log(err, data)
//         if (err) {
//             return err.Message;
//         } else {
//             // console.log(data, "====================================================================data")
//             recievedAdminData = data;
//             return recievedAdminData;
//         }
//     });
//     request(Config.URL.liveRateURL, function (err, resp, body) {
//         if (err) {
//             return err.Message;
//         }
//         var newbody = JSON.parse(body);
//         for (var i = 0; i < newbody.length; i++) {
//             if (newbody[i].symbol == "ETH") {
//                 ETHfactor = (1 / newbody[i].price_usd);
//             }
//         }
//         request(Config.URL.conversionURL, function (err, respns, convertedbody) {
//             if (err) {
//                 return err.Message;
//             }
//             convertedRates = JSON.parse(convertedbody);
//             for (var i = 0; i < newbody.length; i++) {
//                 if (newbody[i].max_supply == null) {
//                     newbody[i].max_supply = "";
//                 }
//                 // Controller.walletController.updateWalletDetails(newbody[i].symbol,newbody[i].name,function(err,data){
//                 //     if(err){
//                 //         return err.message;
//                 //     }
//                 // })
//                 newbody[i].difference = "0";
//                 newbody[i].price_inr = (newbody[i].price_usd * convertedRates.rates.INR).toFixed(2);
//                 newbody[i].price_eth = (newbody[i].price_usd * ETHfactor).toFixed(6);
//                 newbody[i].sellrate_INR = newbody[i].price_inr;
//                 newbody[i].sellrate_USD = newbody[i].price_usd;
//                 newbody[i].sellrate_ETH = newbody[i].price_eth;
//                 newbody[i].sellrate_BTC = newbody[i].price_btc;
//                 if (recievedAdminData) {
//                     // console.log(recievedAdminData, "======================================================recievedAdminData")
//                     for (var j = 0; j < recievedAdminData.length; j++) {
//                         if (recievedAdminData[j].currencysymbol == newbody[i].symbol) {
//                             newbody[i].price_inr = (newbody[i].price_inr * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_usd = (newbody[i].price_usd * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_INR = (newbody[i].price_inr * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_USD = (newbody[i].price_usd * recievedAdminData[j].sellrate).toString();
//                             newbody[i].price_eth = (newbody[i].price_eth * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_btc = (newbody[i].price_btc * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_ETH = (newbody[i].price_eth * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_BTC = (newbody[i].price_btc * recievedAdminData[j].sellrate).toString();
//                             newbody[i].fees = recievedAdminData[j].fees;
//                             newbody[i].gst = recievedAdminData[j].gst;
//                         }
//                     }
//                 }
//                 for (var j = 0; j < recievedDetails.length; j++) {
//                     if (recievedDetails[j].symbol == newbody[i].symbol) {
//                         newbody[i].difference = (recievedDetails[j].percent_change_24h - newbody[i].percent_change_24h).toString();
//                         // console.log(newbody[i].percent_change_24h,"===========================================")
//                     }
//                 }
//                 switch (newbody[i].name) {
//                     case "Bitcoin":
//                         newbody[i].img = path + "/bitcoin.png";
//                         break;
//                     case "Ethereum":
//                         newbody[i].img = path + "/ethereum.png";
//                         break;
//                     case "Ripple":
//                         newbody[i].img = path + "/ripple.png";
//                         break;
//                     case "Bitcoin Cash":
//                         newbody[i].img = path + "/bitcoincash.png";
//                         break;
//                     case "EOS":
//                         newbody[i].img = path + "/eos.png";
//                         break;
//                     case "Litecoin":
//                         newbody[i].img = path + "/litecoin.png";
//                         break;
//                     case "Cardano":
//                         newbody[i].img = path + "/cardano.png";
//                         break;
//                     case "Stellar":
//                         newbody[i].img = path + "/stellar.png";
//                         break;
//                     case "IOTA":
//                         newbody[i].img = path + "/iota.png";
//                         break;
//                     case "NEO":
//                         newbody[i].img = path + "/neo.png";
//                         break;
//                     case "TRON":
//                         newbody[i].img = path + "/tron.png";
//                         break;
//                     case "Monero":
//                         newbody[i].img = path + "/monero.png";
//                         break;
//                     case "Dash":
//                         newbody[i].img = path + "/dash.png";
//                         break;
//                     case "NEM":
//                         newbody[i].img = path + "/nem.png";
//                         break;
//                     case "Tether":
//                         newbody[i].img = path + "/tether.png";
//                         break;
//                     case "OmiseGO":
//                         newbody[i].img = path + "/OmiseGO.png";
//                         break;
//                     case "VeChain":
//                         newbody[i].img = path + "/VeChain.png";
//                         break;
//                     case "Ethereum Classic":
//                         newbody[i].img = path + "/ethereumClassic.png";
//                         break;
//                     case "Qtum":
//                         newbody[i].img = path + "/qtum.png";
//                         break;
//                     case "Binance Coin":
//                         newbody[i].img = path + "/binanceCoin.png";
//                         break;
//                     case "ICON":
//                         newbody[i].img = path + "/icon.png";
//                         break;
//                     case "Bitcoin Gold":
//                         newbody[i].img = path + "/bitcoin_gold.png";
//                         break;
//                     case "Lisk":
//                         newbody[i].img = path + "/lisk.png";
//                         break;
//                     case "Zcash":
//                         newbody[i].img = path + "/zcash.png";
//                         break;
//                     case "Verge":
//                         newbody[i].img = path + "/Verge.png";
//                         break;
//                     case "Steem":
//                         newbody[i].img = path + "/steem.png";
//                         break;
//                     case "Bytom":
//                         newbody[i].img = path + "/Bytom.png";
//                         break;
//                     case "Bitcoin Private":
//                         newbody[i].img = path + "/BitcoinPrivate.png";
//                         break;
//                     case "Nano":
//                         newbody[i].img = path + "/nano.png";
//                         break;
//                     case "Bytecoin":
//                         newbody[i].img = path + "/bytcoin.png";
//                         break;
//                     case "Populous":
//                         newbody[i].img = path + "/Populous.png";
//                         break;
//                     case "Wanchain":
//                         newbody[i].img = path + "/Wanchain.png";
//                         break;
//                     case "Siacoin":
//                         newbody[i].img = path + "/siacoin.png";
//                         break;
//                     case "BitShares":
//                         newbody[i].img = path + "/BitShares.png";
//                         break;
//                     case "Bitcoin Diamond":
//                         newbody[i].img = path + "/bitcoin_diamond.png";
//                         break;
//                     case "Zilliqa":
//                         newbody[i].img = path + "/Zilliqa.png";
//                         break;
//                     case "Ontology":
//                         newbody[i].img = path + "/ontology.png";
//                         break;
//                     case "Aeternity":
//                         newbody[i].img = path + "/Aeternity.png";
//                         break;
//                     case "Maker":
//                         newbody[i].img = path + "/maker.png";
//                         break;
//                     case "Dogecoin":
//                         newbody[i].img = path + "/dogecoin.png";
//                         break;
//                     case "Decred":
//                         newbody[i].img = path + "/Decred.png";
//                         break;
//                     case "Stratis":
//                         newbody[i].img = path + "/Stratis.png";
//                         break;
//                     case "0x":
//                         newbody[i].img = path + "/0x.png";
//                         break;
//                     case "Mixin":
//                         newbody[i].img = path + "/Mixin.png";
//                         break;
//                     case "DigixDAO":
//                         newbody[i].img = path + "/DigixDAO.png";
//                         break;
//                     case "Waves":
//                         newbody[i].img = path + "/waves.png";
//                         break;
//                     case "RChain":
//                         newbody[i].img = path + "/RChain.png";
//                         break;
//                     case "Status":
//                         newbody[i].img = path + "/Status.png";
//                         break;
//                     case "Aion":
//                         newbody[i].img = path + "/Aion.png";
//                         break;
//                     case "Golem":
//                         newbody[i].img = path + "/Golem.png";
//                         break;
//                     case "Augur":
//                         newbody[i].img = path + "/Augur.png";
//                         break;
//                     case "Loopring":
//                         newbody[i].img = path + "/Loopring.png";
//                         break;
//                     case "Basic Attention Token":
//                         newbody[i].img = path + "/BasicAttentionToken.png";
//                         break;
//                     case "Kyber Network":
//                         newbody[i].img = path + "/kyber_network.png";
//                         break;
//                     case "Hshare":
//                         newbody[i].img = path + "/Hshare.png";
//                         break;
//                     case "Waltonchain":
//                         newbody[i].img = path + "/Waltonchain.png";
//                         break;
//                     case "IOST":
//                         newbody[i].img = path + "/io_stoken.png";
//                         break;
//                     case "Komodo":
//                         newbody[i].img = path + "/komodo.png";
//                         break;
//                     case "Ardor":
//                         newbody[i].img = path + "/Ardor.png";
//                         break;
//                     case "DigiByte":
//                         newbody[i].img = path + "/digibyte.png";
//                         break;
//                     case "KuCoin Shares":
//                         newbody[i].img = path + "/KuCoinShares.png";
//                         break;
//                     case "Ark":
//                         newbody[i].img = path + "/Ark.png";
//                         break;
//                     case "Centrality":
//                         newbody[i].img = path + "/Centrality.png";
//                         break;
//                     case "PIVX":
//                         newbody[i].img = path + "/pivx.png";
//                         break;
//                     case "Syscoin":
//                         newbody[i].img = path + "/syscoin.png";
//                         break;
//                     case "Mithril":
//                         newbody[i].img = path + "/mithiril.png";
//                         break;
//                     case "Substratum":
//                         newbody[i].img = path + "/substratum.png";
//                         break;
//                     case "aelf":
//                         newbody[i].img = path + "/aelf.png";
//                         break;
//                     case "MonaCoin":
//                         newbody[i].img = path + "/MonaCoin.png";
//                         break;
//                     case "Cryptonex":
//                         newbody[i].img = path + "/Cryptonex.png";
//                         break;
//                     case "Dragonchain":
//                         newbody[i].img = path + "/Dragonchain.png";
//                         break;
//                     case "Storm":
//                         newbody[i].img = path + "/strom.png";
//                         break;
//                     case "Gas":
//                         newbody[i].img = path + "/Gas.png";
//                         break;
//                     case "QASH":
//                         newbody[i].img = path + "/QASH.png";
//                         break;
//                     case "Dentacoin":
//                         newbody[i].img = path + "/dentacoin.png";
//                         break;
//                     case "Ethos":
//                         newbody[i].img = path + "/ethos.png";
//                         break;
//                     case "Factom":
//                         newbody[i].img = path + "/Factom.png";
//                         break;
//                     case "Pundi X":
//                         newbody[i].img = path + "/pundi.png";
//                         break;
//                     case "Nebulas":
//                         newbody[i].img = path + "/Nebulas.png";
//                         break;
//                     case "Cortex":
//                         newbody[i].img = path + "/Cortex.png";
//                         break;
//                     case "Veritaseum":
//                         newbody[i].img = path + "/Veritaseum.png";
//                         break;
//                     case "Bancor":
//                         newbody[i].img = path + "/bancor.png";
//                         break;
//                     case "ReddCoin":
//                         newbody[i].img = path + "/reddcoin.png";
//                         break;
//                     case "FunFair":
//                         newbody[i].img = path + "/FunFair.png";
//                         break;
//                     case "GXChain":
//                         newbody[i].img = path + "/gxchain.png";
//                         break;
//                     case "Elastos":
//                         newbody[i].img = path + "/elastos.png";
//                         break;
//                     case "SALT":
//                         newbody[i].img = path + "/salt.png";
//                         break;
//                     case "ZCoin":
//                         newbody[i].img = path + "/zcoin.png";
//                         break;
//                     case "Nxt":
//                         newbody[i].img = path + "/nxt.png";
//                         break;
//                     case "WAX":
//                         newbody[i].img = path + "/WAX.png";
//                         break;
//                     case "Kin":
//                         newbody[i].img = path + "/kin.png";
//                         break;
//                     case "Power Ledger":
//                         newbody[i].img = path + "/power_ledger.png";
//                         break;
//                     case "Monaco":
//                         newbody[i].img = path + "/Monaco.png";
//                         break;
//                     case "Revain":
//                         newbody[i].img = path + "/Revain.png";
//                         break;
//                     case "Enigma":
//                         newbody[i].img = path + "/enigma.png";
//                         break;
//                     case "Electroneum":
//                         newbody[i].img = path + "/Electroneum.png";
//                         break;
//                     case "Byteball Bytes":
//                         newbody[i].img = path + "/byteball_bytes.png";
//                         break;
//                     case "Nucleus Vision":
//                         newbody[i].img = path + "/nucleus_vision.png";
//                         break;
//                     case "MaidSafeCoin":
//                         newbody[i].img = path + "/maid_safe.png";
//                         break;
//                     case "ChainLink":
//                         newbody[i].img = path + "/chain_link.png";
//                         break;
//                     case "Gifto":
//                         newbody[i].img = path + "/Gifto.png";
//                         break;
//                     case "CyberMiles":
//                         newbody[i].img = path + "/CyberMiles.png";
//                         break;
//                     case "Fusion":
//                         newbody[i].img = path + "/Fusion.png";
//                         break;
//                     case "Huobi Token":
//                         newbody[i].img = path + "/huobiToken.png";
//                         break;
//                     case "Loom Network":
//                         newbody[i].img = path + "/loomNetwork.png";
//                         break;
//                     case "MOAC":
//                         newbody[i].img = path + "/moac.png";
//                         break;
//                     case "Skycoin":
//                         newbody[i].img = path + "/skycoin.png";
//                         break;
//                     case "Theta Token":
//                         newbody[i].img = path + "/ThetaToken.png";
//                         break;
//                     case "Nuls":
//                         newbody[i].img = path + "/nuls.png";
//                         break;
//                     default:
//                         newbody[i].img = path + "/default_coin.png";
//                 }
//             }
//             if (newbody) {
//                 for (var i = 0; i < newbody.length; i++) {
//                     Controller.coinMarketController.Update({
//                         "symbol": newbody[i].symbol
//                     }, newbody[i], function (err, data) {
//                         if (err) {
//                             return err.message
//                         } else {
//                             console.log(data);
//                         }
//                     })

//                 }

//             } else {
//                 console.log("NO response from api")
//                 return;
//             }
//             if (err) {
//                 res.status(400).send({
//                     "Status": "0",
//                     "Message": err
//                 });
//                 return;
//             } else {
//                 res.status(200).send({
//                     "Status": "1",
//                     "Message": "Updated Succesfully",
//                     "data": newbody
//                 });
//             }
//         });
//     });
// }):
//                         newbody[i].img =  // app.route('/updateData').get((req, res) => {
//     Controller.coinMarketController.findDetail(function (err, data) {
//         if (err) {
//             return err.Message;
//         } else {
//             //console.log(data, "====================================================================data")
//             recievedDetails = data;
//             //console.log(recievedDetails,"(((((((((((((((((((((((((((((((((")
//             return recievedDetails;
//         }
//     })
//     Controller.adminController.viewAdminData(function (err, data) {
//         console.log(err, data)
//         if (err) {
//             return err.Message;
//         } else {
//             // console.log(data, "====================================================================data")
//             recievedAdminData = data;
//             return recievedAdminData;
//         }
//     });
//     request(Config.URL.liveRateURL, function (err, resp, body) {
//         if (err) {
//             return err.Message;
//         }
//         var newbody = JSON.parse(body);
//         for (var i = 0; i < newbody.length; i++) {
//             if (newbody[i].symbol == "ETH") {
//                 ETHfactor = (1 / newbody[i].price_usd);
//             }
//         }
//         request(Config.URL.conversionURL, function (err, respns, convertedbody) {
//             if (err) {
//                 return err.Message;
//             }
//             convertedRates = JSON.parse(convertedbody);
//             for (var i = 0; i < newbody.length; i++) {
//                 if (newbody[i].max_supply == null) {
//                     newbody[i].max_supply = "";
//                 }
//                 // Controller.walletController.updateWalletDetails(newbody[i].symbol,newbody[i].name,function(err,data){
//                 //     if(err){
//                 //         return err.message;
//                 //     }
//                 // })
//                 newbody[i].difference = "0";
//                 newbody[i].price_inr = (newbody[i].price_usd * convertedRates.rates.INR).toFixed(2);
//                 newbody[i].price_eth = (newbody[i].price_usd * ETHfactor).toFixed(6);
//                 newbody[i].sellrate_INR = newbody[i].price_inr;
//                 newbody[i].sellrate_USD = newbody[i].price_usd;
//                 newbody[i].sellrate_ETH = newbody[i].price_eth;
//                 newbody[i].sellrate_BTC = newbody[i].price_btc;
//                 if (recievedAdminData) {
//                     // console.log(recievedAdminData, "======================================================recievedAdminData")
//                     for (var j = 0; j < recievedAdminData.length; j++) {
//                         if (recievedAdminData[j].currencysymbol == newbody[i].symbol) {
//                             newbody[i].price_inr = (newbody[i].price_inr * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_usd = (newbody[i].price_usd * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_INR = (newbody[i].price_inr * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_USD = (newbody[i].price_usd * recievedAdminData[j].sellrate).toString();
//                             newbody[i].price_eth = (newbody[i].price_eth * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_btc = (newbody[i].price_btc * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_ETH = (newbody[i].price_eth * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_BTC = (newbody[i].price_btc * recievedAdminData[j].sellrate).toString();
//                             newbody[i].fees = recievedAdminData[j].fees;
//                             newbody[i].gst = recievedAdminData[j].gst;
//                         }
//                     }
//                 }
//                 for (var j = 0; j < recievedDetails.length; j++) {
//                     if (recievedDetails[j].symbol == newbody[i].symbol) {
//                         newbody[i].difference = (recievedDetails[j].percent_change_24h - newbody[i].percent_change_24h).toString();
//                         // console.log(newbody[i].percent_change_24h,"===========================================")
//                     }
//                 }
//                 switch (newbody[i].name) {
//                     case "Bitcoin":
//                         newbody[i].img = path + "/bitcoin.png";
//                         break;
//                     case "Ethereum":
//                         newbody[i].img = path + "/ethereum.png";
//                         break;
//                     case "Ripple":
//                         newbody[i].img = path + "/ripple.png";
//                         break;
//                     case "Bitcoin Cash":
//                         newbody[i].img = path + "/bitcoincash.png";
//                         break;
//                     case "EOS":
//                         newbody[i].img = path + "/eos.png";
//                         break;
//                     case "Litecoin":
//                         newbody[i].img = path + "/litecoin.png";
//                         break;
//                     case "Cardano":
//                         newbody[i].img = path + "/cardano.png";
//                         break;
//                     case "Stellar":
//                         newbody[i].img = path + "/stellar.png";
//                         break;
//                     case "IOTA":
//                         newbody[i].img = path + "/iota.png";
//                         break;
//                     case "NEO":
//                         newbody[i].img = path + "/neo.png";
//                         break;
//                     case "TRON":
//                         newbody[i].img = path + "/tron.png";
//                         break;
//                     case "Monero":
//                         newbody[i].img = path + "/monero.png";
//                         break;
//                     case "Dash":
//                         newbody[i].img = path + "/dash.png";
//                         break;
//                     case "NEM":
//                         newbody[i].img = path + "/nem.png";
//                         break;
//                     case "Tether":
//                         newbody[i].img = path + "/tether.png";
//                         break;
//                     case "OmiseGO":
//                         newbody[i].img = path + "/OmiseGO.png";
//                         break;
//                     case "VeChain":
//                         newbody[i].img = path + "/VeChain.png";
//                         break;
//                     case "Ethereum Classic":
//                         newbody[i].img = path + "/ethereumClassic.png";
//                         break;
//                     case "Qtum":
//                         newbody[i].img = path + "/qtum.png";
//                         break;
//                     case "Binance Coin":
//                         newbody[i].img = path + "/binanceCoin.png";
//                         break;
//                     case "ICON":
//                         newbody[i].img = path + "/icon.png";
//                         break;
//                     case "Bitcoin Gold":
//                         newbody[i].img = path + "/bitcoin_gold.png";
//                         break;
//                     case "Lisk":
//                         newbody[i].img = path + "/lisk.png";
//                         break;
//                     case "Zcash":
//                         newbody[i].img = path + "/zcash.png";
//                         break;
//                     case "Verge":
//                         newbody[i].img = path + "/Verge.png";
//                         break;
//                     case "Steem":
//                         newbody[i].img = path + "/steem.png";
//                         break;
//                     case "Bytom":
//                         newbody[i].img = path + "/Bytom.png";
//                         break;
//                     case "Bitcoin Private":
//                         newbody[i].img = path + "/BitcoinPrivate.png";
//                         break;
//                     case "Nano":
//                         newbody[i].img = path + "/nano.png";
//                         break;
//                     case "Bytecoin":
//                         newbody[i].img = path + "/bytcoin.png";
//                         break;
//                     case "Populous":
//                         newbody[i].img = path + "/Populous.png";
//                         break;
//                     case "Wanchain":
//                         newbody[i].img = path + "/Wanchain.png";
//                         break;
//                     case "Siacoin":
//                         newbody[i].img = path + "/siacoin.png";
//                         break;
//                     case "BitShares":
//                         newbody[i].img = path + "/BitShares.png";
//                         break;
//                     case "Bitcoin Diamond":
//                         newbody[i].img = path + "/bitcoin_diamond.png";
//                         break;
//                     case "Zilliqa":
//                         newbody[i].img = path + "/Zilliqa.png";
//                         break;
//                     case "Ontology":
//                         newbody[i].img = path + "/ontology.png";
//                         break;
//                     case "Aeternity":
//                         newbody[i].img = path + "/Aeternity.png";
//                         break;
//                     case "Maker":
//                         newbody[i].img = path + "/maker.png";
//                         break;
//                     case "Dogecoin":
//                         newbody[i].img = path + "/dogecoin.png";
//                         break;
//                     case "Decred":
//                         newbody[i].img = path + "/Decred.png";
//                         break;
//                     case "Stratis":
//                         newbody[i].img = path + "/Stratis.png";
//                         break;
//                     case "0x":
//                         newbody[i].img = path + "/0x.png";
//                         break;
//                     case "Mixin":
//                         newbody[i].img = path + "/Mixin.png";
//                         break;
//                     case "DigixDAO":
//                         newbody[i].img = path + "/DigixDAO.png";
//                         break;
//                     case "Waves":
//                         newbody[i].img = path + "/waves.png";
//                         break;
//                     case "RChain":
//                         newbody[i].img = path + "/RChain.png";
//                         break;
//                     case "Status":
//                         newbody[i].img = path + "/Status.png";
//                         break;
//                     case "Aion":
//                         newbody[i].img = path + "/Aion.png";
//                         break;
//                     case "Golem":
//                         newbody[i].img = path + "/Golem.png";
//                         break;
//                     case "Augur":
//                         newbody[i].img = path + "/Augur.png";
//                         break;
//                     case "Loopring":
//                         newbody[i].img = path + "/Loopring.png";
//                         break;
//                     case "Basic Attention Token":
//                         newbody[i].img = path + "/BasicAttentionToken.png";
//                         break;
//                     case "Kyber Network":
//                         newbody[i].img = path + "/kyber_network.png";
//                         break;
//                     case "Hshare":
//                         newbody[i].img = path + "/Hshare.png";
//                         break;
//                     case "Waltonchain":
//                         newbody[i].img = path + "/Waltonchain.png";
//                         break;
//                     case "IOST":
//                         newbody[i].img = path + "/io_stoken.png";
//                         break;
//                     case "Komodo":
//                         newbody[i].img = path + "/komodo.png";
//                         break;
//                     case "Ardor":
//                         newbody[i].img = path + "/Ardor.png";
//                         break;
//                     case "DigiByte":
//                         newbody[i].img = path + "/digibyte.png";
//                         break;
//                     case "KuCoin Shares":
//                         newbody[i].img = path + "/KuCoinShares.png";
//                         break;
//                     case "Ark":
//                         newbody[i].img = path + "/Ark.png";
//                         break;
//                     case "Centrality":
//                         newbody[i].img = path + "/Centrality.png";
//                         break;
//                     case "PIVX":
//                         newbody[i].img = path + "/pivx.png";
//                         break;
//                     case "Syscoin":
//                         newbody[i].img = path + "/syscoin.png";
//                         break;
//                     case "Mithril":
//                         newbody[i].img = path + "/mithiril.png";
//                         break;
//                     case "Substratum":
//                         newbody[i].img = path + "/substratum.png";
//                         break;
//                     case "aelf":
//                         newbody[i].img = path + "/aelf.png";
//                         break;
//                     case "MonaCoin":
//                         newbody[i].img = path + "/MonaCoin.png";
//                         break;
//                     case "Cryptonex":
//                         newbody[i].img = path + "/Cryptonex.png";
//                         break;
//                     case "Dragonchain":
//                         newbody[i].img = path + "/Dragonchain.png";
//                         break;
//                     case "Storm":
//                         newbody[i].img = path + "/strom.png";
//                         break;
//                     case "Gas":
//                         newbody[i].img = path + "/Gas.png";
//                         break;
//                     case "QASH":
//                         newbody[i].img = path + "/QASH.png";
//                         break;
//                     case "Dentacoin":
//                         newbody[i].img = path + "/dentacoin.png";
//                         break;
//                     case "Ethos":
//                         newbody[i].img = path + "/ethos.png";
//                         break;
//                     case "Factom":
//                         newbody[i].img = path + "/Factom.png";
//                         break;
//                     case "Pundi X":
//                         newbody[i].img = path + "/pundi.png";
//                         break;
//                     case "Nebulas":
//                         newbody[i].img = path + "/Nebulas.png";
//                         break;
//                     case "Cortex":
//                         newbody[i].img = path + "/Cortex.png";
//                         break;
//                     case "Veritaseum":
//                         newbody[i].img = path + "/Veritaseum.png";
//                         break;
//                     case "Bancor":
//                         newbody[i].img = path + "/bancor.png";
//                         break;
//                     case "ReddCoin":
//                         newbody[i].img = path + "/reddcoin.png";
//                         break;
//                     case "FunFair":
//                         newbody[i].img = path + "/FunFair.png";
//                         break;
//                     case "GXChain":
//                         newbody[i].img = path + "/gxchain.png";
//                         break;
//                     case "Elastos":
//                         newbody[i].img = path + "/elastos.png";
//                         break;
//                     case "SALT":
//                         newbody[i].img = path + "/salt.png";
//                         break;
//                     case "ZCoin":
//                         newbody[i].img = path + "/zcoin.png";
//                         break;
//                     case "Nxt":
//                         newbody[i].img = path + "/nxt.png";
//                         break;
//                     case "WAX":
//                         newbody[i].img = path + "/WAX.png";
//                         break;
//                     case "Kin":
//                         newbody[i].img = path + "/kin.png";
//                         break;
//                     case "Power Ledger":
//                         newbody[i].img = path + "/power_ledger.png";
//                         break;
//                     case "Monaco":
//                         newbody[i].img = path + "/Monaco.png";
//                         break;
//                     case "Revain":
//                         newbody[i].img = path + "/Revain.png";
//                         break;
//                     case "Enigma":
//                         newbody[i].img = path + "/enigma.png";
//                         break;
//                     case "Electroneum":
//                         newbody[i].img = path + "/Electroneum.png";
//                         break;
//                     case "Byteball Bytes":
//                         newbody[i].img = path + "/byteball_bytes.png";
//                         break;
//                     case "Nucleus Vision":
//                         newbody[i].img = path + "/nucleus_vision.png";
//                         break;
//                     case "MaidSafeCoin":
//                         newbody[i].img = path + "/maid_safe.png";
//                         break;
//                     case "ChainLink":
//                         newbody[i].img = path + "/chain_link.png";
//                         break;
//                     case "Gifto":
//                         newbody[i].img = path + "/Gifto.png";
//                         break;
//                     case "CyberMiles":
//                         newbody[i].img = path + "/CyberMiles.png";
//                         break;
//                     case "Fusion":
//                         newbody[i].img = path + "/Fusion.png";
//                         break;
//                     case "Huobi Token":
//                         newbody[i].img = path + "/huobiToken.png";
//                         break;
//                     case "Loom Network":
//                         newbody[i].img = path + "/loomNetwork.png";
//                         break;
//                     case "MOAC":
//                         newbody[i].img = path + "/moac.png";
//                         break;
//                     case "Skycoin":
//                         newbody[i].img = path + "/skycoin.png";
//                         break;
//                     case "Theta Token":
//                         newbody[i].img = path + "/ThetaToken.png";
//                         break;
//                     case "Nuls":
//                         newbody[i].img = path + "/nuls.png";
//                         break;
//                     default:
//                         newbody[i].img = path + "/default_coin.png";
//                 }
//             }
//             if (newbody) {
//                 for (var i = 0; i < newbody.length; i++) {
//                     Controller.coinMarketController.Update({
//                         "symbol": newbody[i].symbol
//                     }, newbody[i], function (err, data) {
//                         if (err) {
//                             return err.message
//                         } else {
//                             console.log(data);
//                         }
//                     })

//                 }

//             } else {
//                 console.log("NO response from api")
//                 return;
//             }
//             if (err) {
//                 res.status(400).send({
//                     "Status": "0",
//                     "Message": err
//                 });
//                 return;
//             } else {
//                 res.status(200).send({
//                     "Status": "1",
//                     "Message": "Updated Succesfully",
//                     "data": newbody
//                 });
//             }
//         });
//     });
// })path + "/nucleus_vision.png";
//                         break;
//                     case "MaidSafeCoin":  // app.route('/updateData').get((req, res) => {
//     Controller.coinMarketController.findDetail(function (err, data) {
//         if (err) {
//             return err.Message;
//         } else {
//             //console.log(data, "====================================================================data")
//             recievedDetails = data;
//             //console.log(recievedDetails,"(((((((((((((((((((((((((((((((((")
//             return recievedDetails;
//         }
//     })
//     Controller.adminController.viewAdminData(function (err, data) {
//         console.log(err, data)
//         if (err) {
//             return err.Message;
//         } else {
//             // console.log(data, "====================================================================data")
//             recievedAdminData = data;
//             return recievedAdminData;
//         }
//     });
//     request(Config.URL.liveRateURL, function (err, resp, body) {
//         if (err) {
//             return err.Message;
//         }
//         var newbody = JSON.parse(body);
//         for (var i = 0; i < newbody.length; i++) {
//             if (newbody[i].symbol == "ETH") {
//                 ETHfactor = (1 / newbody[i].price_usd);
//             }
//         }
//         request(Config.URL.conversionURL, function (err, respns, convertedbody) {
//             if (err) {
//                 return err.Message;
//             }
//             convertedRates = JSON.parse(convertedbody);
//             for (var i = 0; i < newbody.length; i++) {
//                 if (newbody[i].max_supply == null) {
//                     newbody[i].max_supply = "";
//                 }
//                 // Controller.walletController.updateWalletDetails(newbody[i].symbol,newbody[i].name,function(err,data){
//                 //     if(err){
//                 //         return err.message;
//                 //     }
//                 // })
//                 newbody[i].difference = "0";
//                 newbody[i].price_inr = (newbody[i].price_usd * convertedRates.rates.INR).toFixed(2);
//                 newbody[i].price_eth = (newbody[i].price_usd * ETHfactor).toFixed(6);
//                 newbody[i].sellrate_INR = newbody[i].price_inr;
//                 newbody[i].sellrate_USD = newbody[i].price_usd;
//                 newbody[i].sellrate_ETH = newbody[i].price_eth;
//                 newbody[i].sellrate_BTC = newbody[i].price_btc;
//                 if (recievedAdminData) {
//                     // console.log(recievedAdminData, "======================================================recievedAdminData")
//                     for (var j = 0; j < recievedAdminData.length; j++) {
//                         if (recievedAdminData[j].currencysymbol == newbody[i].symbol) {
//                             newbody[i].price_inr = (newbody[i].price_inr * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_usd = (newbody[i].price_usd * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_INR = (newbody[i].price_inr * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_USD = (newbody[i].price_usd * recievedAdminData[j].sellrate).toString();
//                             newbody[i].price_eth = (newbody[i].price_eth * recievedAdminData[j].buyrate).toString();
//                             newbody[i].price_btc = (newbody[i].price_btc * recievedAdminData[j].buyrate).toString();
//                             newbody[i].sellrate_ETH = (newbody[i].price_eth * recievedAdminData[j].sellrate).toString();
//                             newbody[i].sellrate_BTC = (newbody[i].price_btc * recievedAdminData[j].sellrate).toString();
//                             newbody[i].fees = recievedAdminData[j].fees;
//                             newbody[i].gst = recievedAdminData[j].gst;
//                         }
//                     }
//                 }
//                 for (var j = 0; j < recievedDetails.length; j++) {
//                     if (recievedDetails[j].symbol == newbody[i].symbol) {
//                         newbody[i].difference = (recievedDetails[j].percent_change_24h - newbody[i].percent_change_24h).toString();
//                         // console.log(newbody[i].percent_change_24h,"===========================================")
//                     }
//                 }
//                 switch (newbody[i].name) {
//                     case "Bitcoin":
//                         newbody[i].img = path + "/bitcoin.png";
//                         break;
//                     case "Ethereum":
//                         newbody[i].img = path + "/ethereum.png";
//                         break;
//                     case "Ripple":
//                         newbody[i].img = path + "/ripple.png";
//                         break;
//                     case "Bitcoin Cash":
//                         newbody[i].img = path + "/bitcoincash.png";
//                         break;
//                     case "EOS":
//                         newbody[i].img = path + "/eos.png";
//                         break;
//                     case "Litecoin":
//                         newbody[i].img = path + "/litecoin.png";
//                         break;
//                     case "Cardano":
//                         newbody[i].img = path + "/cardano.png";
//                         break;
//                     case "Stellar":
//                         newbody[i].img = path + "/stellar.png";
//                         break;
//                     case "IOTA":
//                         newbody[i].img = path + "/iota.png";
//                         break;
//                     case "NEO":
//                         newbody[i].img = path + "/neo.png";
//                         break;
//                     case "TRON":
//                         newbody[i].img = path + "/tron.png";
//                         break;
//                     case "Monero":
//                         newbody[i].img = path + "/monero.png";
//                         break;
//                     case "Dash":
//                         newbody[i].img = path + "/dash.png";
//                         break;
//                     case "NEM":
//                         newbody[i].img = path + "/nem.png";
//                         break;
//                     case "Tether":
//                         newbody[i].img = path + "/tether.png";
//                         break;
//                     case "OmiseGO":
//                         newbody[i].img = path + "/OmiseGO.png";
//                         break;
//                     case "VeChain":
//                         newbody[i].img = path + "/VeChain.png";
//                         break;
//                     case "Ethereum Classic":
//                         newbody[i].img = path + "/ethereumClassic.png";
//                         break;
//                     case "Qtum":
//                         newbody[i].img = path + "/qtum.png";
//                         break;
//                     case "Binance Coin":
//                         newbody[i].img = path + "/binanceCoin.png";
//                         break;
//                     case "ICON":
//                         newbody[i].img = path + "/icon.png";
//                         break;
//                     case "Bitcoin Gold":
//                         newbody[i].img = path + "/bitcoin_gold.png";
//                         break;
//                     case "Lisk":
//                         newbody[i].img = path + "/lisk.png";
//                         break;
//                     case "Zcash":
//                         newbody[i].img = path + "/zcash.png";
//                         break;
//                     case "Verge":
//                         newbody[i].img = path + "/Verge.png";
//                         break;
//                     case "Steem":
//                         newbody[i].img = path + "/steem.png";
//                         break;
//                     case "Bytom":
//                         newbody[i].img = path + "/Bytom.png";
//                         break;
//                     case "Bitcoin Private":
//                         newbody[i].img = path + "/BitcoinPrivate.png";
//                         break;
//                     case "Nano":
//                         newbody[i].img = path + "/nano.png";
//                         break;
//                     case "Bytecoin":
//                         newbody[i].img = path + "/bytcoin.png";
//                         break;
//                     case "Populous":
//                         newbody[i].img = path + "/Populous.png";
//                         break;
//                     case "Wanchain":
//                         newbody[i].img = path + "/Wanchain.png";
//                         break;
//                     case "Siacoin":
//                         newbody[i].img = path + "/siacoin.png";
//                         break;
//                     case "BitShares":
//                         newbody[i].img = path + "/BitShares.png";
//                         break;
//                     case "Bitcoin Diamond":
//                         newbody[i].img = path + "/bitcoin_diamond.png";
//                         break;
//                     case "Zilliqa":
//                         newbody[i].img = path + "/Zilliqa.png";
//                         break;
//                     case "Ontology":
//                         newbody[i].img = path + "/ontology.png";
//                         break;
//                     case "Aeternity":
//                         newbody[i].img = path + "/Aeternity.png";
//                         break;
//                     case "Maker":
//                         newbody[i].img = path + "/maker.png";
//                         break;
//                     case "Dogecoin":
//                         newbody[i].img = path + "/dogecoin.png";
//                         break;
//                     case "Decred":
//                         newbody[i].img = path + "/Decred.png";
//                         break;
//                     case "Stratis":
//                         newbody[i].img = path + "/Stratis.png";
//                         break;
//                     case "0x":
//                         newbody[i].img = path + "/0x.png";
//                         break;
//                     case "Mixin":
//                         newbody[i].img = path + "/Mixin.png";
//                         break;
//                     case "DigixDAO":
//                         newbody[i].img = path + "/DigixDAO.png";
//                         break;
//                     case "Waves":
//                         newbody[i].img = path + "/waves.png";
//                         break;
//                     case "RChain":
//                         newbody[i].img = path + "/RChain.png";
//                         break;
//                     case "Status":
//                         newbody[i].img = path + "/Status.png";
//                         break;
//                     case "Aion":
//                         newbody[i].img = path + "/Aion.png";
//                         break;
//                     case "Golem":
//                         newbody[i].img = path + "/Golem.png";
//                         break;
//                     case "Augur":
//                         newbody[i].img = path + "/Augur.png";
//                         break;
//                     case "Loopring":
//                         newbody[i].img = path + "/Loopring.png";
//                         break;
//                     case "Basic Attention Token":
//                         newbody[i].img = path + "/BasicAttentionToken.png";
//                         break;
//                     case "Kyber Network":
//                         newbody[i].img = path + "/kyber_network.png";
//                         break;
//                     case "Hshare":
//                         newbody[i].img = path + "/Hshare.png";
//                         break;
//                     case "Waltonchain":
//                         newbody[i].img = path + "/Waltonchain.png";
//                         break;
//                     case "IOST":
//                         newbody[i].img = path + "/io_stoken.png";
//                         break;
//                     case "Komodo":
//                         newbody[i].img = path + "/komodo.png";
//                         break;
//                     case "Ardor":
//                         newbody[i].img = path + "/Ardor.png";
//                         break;
//                     case "DigiByte":
//                         newbody[i].img = path + "/digibyte.png";
//                         break;
//                     case "KuCoin Shares":
//                         newbody[i].img = path + "/KuCoinShares.png";
//                         break;
//                     case "Ark":
//                         newbody[i].img = path + "/Ark.png";
//                         break;
//                     case "Centrality":
//                         newbody[i].img = path + "/Centrality.png";
//                         break;
//                     case "PIVX":
//                         newbody[i].img = path + "/pivx.png";
//                         break;
//                     case "Syscoin":
//                         newbody[i].img = path + "/syscoin.png";
//                         break;
//                     case "Mithril":
//                         newbody[i].img = path + "/mithiril.png";
//                         break;
//                     case "Substratum":
//                         newbody[i].img = path + "/substratum.png";
//                         break;
//                     case "aelf":
//                         newbody[i].img = path + "/aelf.png";
//                         break;
//                     case "MonaCoin":
//                         newbody[i].img = path + "/MonaCoin.png";
//                         break;
//                     case "Cryptonex":
//                         newbody[i].img = path + "/Cryptonex.png";
//                         break;
//                     case "Dragonchain":
//                         newbody[i].img = path + "/Dragonchain.png";
//                         break;
//                     case "Storm":
//                         newbody[i].img = path + "/strom.png";
//                         break;
//                     case "Gas":
//                         newbody[i].img = path + "/Gas.png";
//                         break;
//                     case "QASH":
//                         newbody[i].img = path + "/QASH.png";
//                         break;
//                     case "Dentacoin":
//                         newbody[i].img = path + "/dentacoin.png";
//                         break;
//                     case "Ethos":
//                         newbody[i].img = path + "/ethos.png";
//                         break;
//                     case "Factom":
//                         newbody[i].img = path + "/Factom.png";
//                         break;
//                     case "Pundi X":
//                         newbody[i].img = path + "/pundi.png";
//                         break;
//                     case "Nebulas":
//                         newbody[i].img = path + "/Nebulas.png";
//                         break;
//                     case "Cortex":
//                         newbody[i].img = path + "/Cortex.png";
//                         break;
//                     case "Veritaseum":
//                         newbody[i].img = path + "/Veritaseum.png";
//                         break;
//                     case "Bancor":
//                         newbody[i].img = path + "/bancor.png";
//                         break;
//                     case "ReddCoin":
//                         newbody[i].img = path + "/reddcoin.png";
//                         break;
//                     case "FunFair":
//                         newbody[i].img = path + "/FunFair.png";
//                         break;
//                     case "GXChain":
//                         newbody[i].img = path + "/gxchain.png";
//                         break;
//                     case "Elastos":
//                         newbody[i].img = path + "/elastos.png";
//                         break;
//                     case "SALT":
//                         newbody[i].img = path + "/salt.png";
//                         break;
//                     case "ZCoin":
//                         newbody[i].img = path + "/zcoin.png";
//                         break;
//                     case "Nxt":
//                         newbody[i].img = path + "/nxt.png";
//                         break;
//                     case "WAX":
//                         newbody[i].img = path + "/WAX.png";
//                         break;
//                     case "Kin":
//                         newbody[i].img = path + "/kin.png";
//                         break;
//                     case "Power Ledger":
//                         newbody[i].img = path + "/power_ledger.png";
//                         break;
//                     case "Monaco":
//                         newbody[i].img = path + "/Monaco.png";
//                         break;
//                     case "Revain":
//                         newbody[i].img = path + "/Revain.png";
//                         break;
//                     case "Enigma":
//                         newbody[i].img = path + "/enigma.png";
//                         break;
//                     case "Electroneum":
//                         newbody[i].img = path + "/Electroneum.png";
//                         break;
//                     case "Byteball Bytes":
//                         newbody[i].img = path + "/byteball_bytes.png";
//                         break;
//                     case "Nucleus Vision":
//                         newbody[i].img = path + "/nucleus_vision.png";
//                         break;
//                     case "MaidSafeCoin":
//                         newbody[i].img = path + "/maid_safe.png";
//                         break;
//                     case "ChainLink":
//                         newbody[i].img = path + "/chain_link.png";
//                         break;
//                     case "Gifto":
//                         newbody[i].img = path + "/Gifto.png";
//                         break;
//                     case "CyberMiles":
//                         newbody[i].img = path + "/CyberMiles.png";
//                         break;
//                     case "Fusion":
//                         newbody[i].img = path + "/Fusion.png";
//                         break;
//                     case "Huobi Token":
//                         newbody[i].img = path + "/huobiToken.png";
//                         break;
//                     case "Loom Network":
//                         newbody[i].img = path + "/loomNetwork.png";
//                         break;
//                     case "MOAC":
//                         newbody[i].img = path + "/moac.png";
//                         break;
//                     case "Skycoin":
//                         newbody[i].img = path + "/skycoin.png";
//                         break;
//                     case "Theta Token":
//                         newbody[i].img = path + "/ThetaToken.png";
//                         break;
//                     case "Nuls":
//                         newbody[i].img = path + "/nuls.png";
//                         break;
//                     default:
//                         newbody[i].img = path + "/default_coin.png";
//                 }
//             }
//             if (newbody) {
//                 for (var i = 0; i < newbody.length; i++) {
//                     Controller.coinMarketController.Update({
//                         "symbol": newbody[i].symbol
//                     }, newbody[i], function (err, data) {
//                         if (err) {
//                             return err.message
//                         } else {
//                             console.log(data);
//                         }
//                     })

//                 }

//             } else {
//                 console.log("NO response from api")
//                 return;
//             }
//             if (err) {
//                 res.status(400).send({
//                     "Status": "0",
//                     "Message": err
//                 });
//                 return;
//             } else {
//                 res.status(200).send({
//                     "Status": "1",
//                     "Message": "Updated Succesfully",
//                     "data": newbody
//                 });
//             }
//         });
//     });
// })
//                         newbody[i].img = path + "/maid_safe.png";
//                         break;
//                     case "ChainLink":
//                         newbody[i].img = path + "/chain_link.png";
//                         break;
//                     case "Gifto":
//                         newbody[i].img = path + "/Gifto.png";
//                         break;
//                     case "CyberMiles":
//                         newbody[i].img = path + "/CyberMiles.png";
//                         break;
//                     case "Fusion":
//                         newbody[i].img = path + "/Fusion.png";
//                         break;
//                     case "Huobi Token":
//                         newbody[i].img = path + "/huobiToken.png";
//                         break;
//                     case "Loom Network":
//                         newbody[i].img = path + "/loomNetwork.png";
//                         break;
//                     case "MOAC":
//                         newbody[i].img = path + "/moac.png";
//                         break;
//                     case "Skycoin":
//                         newbody[i].img = path + "/skycoin.png";
//                         break;
//                     case "Theta Token":
//                         newbody[i].img = path + "/ThetaToken.png";
//                         break;
//                     case "Nuls":
//                         newbody[i].img = path + "/nuls.png";
//                         break;
//                     default:
//                         newbody[i].img = path + "/default_coin.png";
//                 }
//             }
//             if (newbody) {
//                 for (var i = 0; i < newbody.length; i++) {
//                     Controller.coinMarketController.Update({
//                         "symbol": newbody[i].symbol
//                     }, newbody[i], function (err, data) {
//                         if (err) {
//                             return err.message
//                         } else {
//                             console.log(data);
//                         }
//                     })

//                 }

//             } else {
//                 console.log("NO response from api")
//                 return;
//             }
//             if (err) {
//                 res.status(400).send({
//                     "Status": "0",
//                     "Message": err
//                 });
//                 return;
//             } else {
//                 res.status(200).send({
//                     "Status": "1",
//                     "Message": "Updated Succesfully",
//                     "data": newbody
//                 });
//             }
//         });
//     });
// })