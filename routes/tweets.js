var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlEncoded = bodyParser.urlencoded({extended: false});

var redis = require("redis");
var client = redis.createClient();

router.get('/', function(req, res) {
    var tweets = [];
    client.hgetall('tweets', function (err, replies) {
        Object.keys(replies).forEach(function (key) {
            tweets.push({
                id: key,
                newId: replies[key]
            });
        });
        res.json(tweets);
    });
});

module.exports = router;