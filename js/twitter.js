var Twitter = require('twitter');

const helpers = require('../helpers.js');

// Connect to Twitter
var twitApi = null;
if (helpers.auth.twitter) {
    twitApi = new Twitter(helpers.auth.twitter);
}

function listen(channels, hashtags) {
    if (twitApi) {
        // Get tweets from stream
        twitApi.stream('statuses/filter', {track: hashtags}, function (stream) {
            stream.on('data', function (event) {
                let tags = event.entities.hashtags;
                for (var i = 0; i < tags.length; i++) {
                    let tag = '#' + tags[i].text;
                    for (var j = 0; j < helpers.config[tag].length; j++) {
                        let user = event.user.screen_name;
                        let channel = channels.get(helpers.config[tag][j]);
                        if (channel !== undefined) {
                            channel.sendMessage(
                                '`New ' + tag + ' tweet by ' + user + '`: '
                                + event.text + '\n'
                                + 'https://twitter.com/' + user + '/status/' + event.id_str
                            );
                        }
                    }
                }
            });
            stream.on('error', function (error) {
                throw error;
            });
        });
    }
}

function tweet(channel, status) {
    if (twitApi) {
        twitApi.post('statuses/update', {status: status},  function (error, tweet, response) {
            if (error) {
                throw error;
            }
            channel.sendMessage(
                'https://twitter.com/'
                + tweet.user.screen_name
                + '/status/'
                + tweet.id_str
            );
        });
    }
}

module.exports = {
    listen: listen,
    tweet: tweet
};