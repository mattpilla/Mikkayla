var Twitter = require('twitter');

const helpers = require('../helpers.js');

// Connect to Twitter
var twitApi = null;
if (helpers.auth.twitter) {
    twitApi = new Twitter(helpers.auth.twitter);
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
    tweet: tweet
};
