const express = require('express');
var app = express();
bodyParser = require('body-parser')
app.use(bodyParser.json());
var CronJob = require('cron').CronJob;
app.use(bodyParser.urlencoded({
    extended: true
}));
////Used for Cross origin ////////
var cors = require('cors');
app.use(cors());
////ODM for mongo /////////////////
var mongoose = require('mongoose');
var path = require('path');
const request = require('request');
const Config = require('./config');
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
mongoose.Promise = global.Promise;
aws.config.loadFromPath(__dirname+'/s3_config.json');
var s3 = new aws.S3({
    s3ForcePathStyle: true
});
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'cryptoexchange',
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: file.fieldname
            });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})
app.post('/upload', upload.single('avatar'), function (req, res, next) {
    console.log(req.file, "req.file");
console.log(`req.params`,req.body.type);
    res.send({
        "Message": "Successfully uploaded files!"
    });
})

///Connection to mongodb///////////////////////
mongoose.connect("mongodb://localhost/coinmarketDB", err => {
    if (err) {
        console.log("DB Error: ", err);
        process.exit(1);
    } else {
        console.log('MongoDB Connected');
    }
});
////For Debugging Mongo////////////
mongoose.set('debug', true);
var CronJob = require('cron').CronJob;
////CronJob created////////////////////////
var job = new CronJob({
    cronTime: '00 */5 * * * *',
    onTick: function () {
        ////////////For updating the data in graphrates collection for graphs////////////////
        request('http://' + Config.ServerPath +'/graphCryptoRates', (err, resp, body) => {
                if (err) {
                    return err.message;
                } else {
                    console.log(JSON.parse(body));
                }
                console.log('IN CRON JOB graph=============================================');
            }),
            /////////For updating the data in cryptorates collection //////////////////
            request('http://' + Config.ServerPath + '/updateCryptoRates', (err, resp, body) => {
                if (err) {
                    return err.message;
                } else {
                    console.log(JSON.parse(body));
                }
                console.log('IN CRON JOB update==================================================');
            }),

            /////////For all the transaction in which stop loss or profit is there////////////////////
            request('http://' + Config.ServerPath + '/StopLossOrProfit', (err, resp, body) => {
                if (err) {
                    return err.message;
                } else {
                    console.log(JSON.parse(body));
                }
                console.log('IN CRON JOB 3');
            }),
            /////////For all the contracts to be closed if completed////////////////////
            request('http://' + Config.ServerPath + '/transactContract', (err, resp, body) => {
                if (err) {
                    return err.message;
                } else {
                    console.log(JSON.parse(body));
                }
                console.log('IN CRON JOB 4');

            }),
            /////////For all the deals to be closed if completed////////////////////
            request('http://' + Config.ServerPath + '/transactDeal', (err, resp, body) => {
                if (err) {
                    return err.message;
                } else {
                    console.log(JSON.parse(body));
                }
                console.log('IN CRON JOB 5');

            })
    },
    start: false,
    timeZone: 'UTC'
});
/////Cronjob for updating transaction///////////////////////////
var updateTransactionJob = new CronJob({
    cronTime: '00 * * * * *',
    onTick: function () {
        request('http://' + Config.ServerPath + '/updateTransactionCron', function (err, resp, body) {
            if (err) {
                return err.message;
            } else {
                console.log(JSON.parse(body));
            }
            console.log('IN CRON JOB 2');
        })
    },
    start: false,
    timeZone: 'UTC'
});
///////////////////////****************************************BITGO STARTS*********************************////////////
///////////////Using Bitgo library, remove if don't want to use Bitgo///////////////////////////
var BitGoJS = require('bitgo');
var accessToken = process.env.ACCESS_TOKEN;
var bitgo = new BitGoJS.BitGo({
    env: 'test',
    accessToken: accessToken
});
console.log("BitGoJS library version: " + bitgo.version());
bitgo.session({})
    .then(function (res) {
        console.log("AUTHENTICATED SUCCESS===============================")
        console.log(res);
    })
    .catch(function (err) {
        console.log(err);
    });
    ///////////////////********************************BITGO ENDS********************************////////////////////
////////////////Cronjob Starts///////////////////////////////////
job.start();
updateTransactionJob.start();
require('./routes/coinmarketcap')(app);
require('./routes/admindata')(app);
require('./routes/coindetail')(app);
require('./routes/transactiondetails')(app);
require('./routes/walletgenerate')(app);
require('./routes/deal')(app);
require('./routes/user')(app);
require('./routes/support')(app);
app.use('/', express.static(path.join(__dirname, 'images')));
app.listen(3000, '0.0.0.0', () => {
    console.log('Example app listening on port 3000!')
});