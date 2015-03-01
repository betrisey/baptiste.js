var express = require('express');
var router = express.Router();

var redis = require("redis")
var client = redis.createClient();

/* GET home page. */
router.get('/', function(req, res, next) {
    var tweets = [];
    client.hgetall("tweets", function (err, replies) {
        Object.keys(replies).forEach(function (key) {
            tweets.push({
                id: key,
                newId: replies[key]
            });
        });

        res.render('index', {tweets: tweets});
    });

});

module.exports = router;
