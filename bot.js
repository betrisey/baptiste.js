var Twit = require('twit')

var T = new Twit({
    consumer_key:         ''
    , consumer_secret:      ''
    , access_token:         ''
    , access_token_secret:  ''
});

var redis = require("redis");
var client = redis.createClient();

module.exports = function(count) {
    T.get('search/tweets', { q: 'j\'ai', count: count, lang: 'fr'}, function(err, data, response) {
        data.statuses.forEach(function(status, index) {
            tweetBaptiste(status.id_str, status.text, status.user.screen_name);
        });
    });
}

var tweetBaptiste = function(id, text, user){
    process.nextTick(function(){
        client.hexists('tweets', id, function(err, replies) {
            if(replies == 0) {
                text = text.replace();

                // Pas d'url, @, RT
                text = text.replace(/\b(RT|MT) .+/,''); //take out anything after RT or MT
                text = text.replace(/(\#|@|(h\/t)|(http))\S+/,''); //Take out URLs, hashtags, hts, etc.
                text = text.replace(/\n/,''); //take out new lines.
                // Début phrase
                text = text.replace(/j'étais/i, "Ah, toi aussi tu étais");
                text = text.replace(/j'ai/i, "Ah, toi aussi tu as");
                text = text.replace(/j'avais/i, "Ah, toi aussi tu avais");
                // Rien avant Ah toi aussi
                text = text.replace(/^(.*Ah, toi aussi )/,"Ah, toi aussi ");
                // Remplacement du reste
                text = text.replace(/je suis/ig, "tu es");
                text = text.replace(/j'étais/ig, "tu étais");
                text = text.replace(/j étais/ig, "tu étais");
                text = text.replace(/j'ai/ig, "tu as");
                text = text.replace(/j ai/ig, "tu as");
                text = text.replace(/j'avais/ig, "tu avais");
                text = text.replace(/j avais/ig, "tu avais");
                text = text.replace(/j'/ig, "t'");
                text = text.replace(/je'/ig, "tu'");
                text = text.replace(/mon/ig, "ton");
                text = text.replace(/ma/ig, "ta");
                text = text.replace(/mes/ig, "tes");
                text = text.replace(/me/ig, "te");

                if (text.length < 1)
                    return false;

                text = '@' + user + ' ' + text;
                // Coupe la fin si plus de 130 caractères
                if (text.length > 130)
                    text = text.substr(0, 129);

                text = text + " #Baptiste";

                T.post('statuses/update', {status: text}, function(err,data, response){
                    var newId = data.id_str;
                    client.hset('tweets', id, newId, function () {
                        console.log(data.text);
                    });
                });
            }
        });
    });
};