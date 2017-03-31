var Twitter = require('twitter');

const helpers = require('../helpers.js');

// Connect to Twitter
var twitApi = null;
if (helpers.auth.twitter) {
    twitApi = new Twitter(helpers.auth.twitter);
}

function listen(channels) {
    if (twitApi) {
        // Get zsr hashtags from config
        let zsr = helpers.config.zsr;
        let hashtags = Object.keys(zsr).join(', ');
        // Get tweets from stream
        twitApi.stream('statuses/filter', {track: hashtags}, function (stream) {
            stream.on('data', function (event) {
                if (event.text != null && event.text.indexOf('RT ') !== 0 && !event.retweet_count && !event.favorite_count) {
                    let userId = event.user.id_str;
                    let blacklist = helpers.config.blacklist;
                    // Ignore tweet if from blacklisted user
                    for (let i = 0; i < blacklist.length; i++) {
                        if (userId === blacklist[i].id) {
                            helpers.msgHome(channels, 'blacklisted tweet');
                            return;
                        }
                    }
                    let tags = event.entities.hashtags;
                    for (var i = 0; i < tags.length; i++) {
                        let tag = '#' + tags[i].text.toLowerCase();
                        let tagChannels = zsr[tag];
                        if (tagChannels !== undefined) {
                            for (var j = 0; j < tagChannels.length; j++) {
                                let user = event.user.screen_name;
                                let channel = channels.get(tagChannels[j]);
                                if (channel !== undefined) {
                                    channel.sendMessage(
                                        '`New ' + tag + ' tweet by ' + user + '`: '
                                        + event.text + '\n'
                                        + '<https://twitter.com/' + user + '/status/' + event.id_str + '>'
                                    );
                                }
                            }
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
                '<https://twitter.com/'
                + tweet.user.screen_name
                + '/status/'
                + tweet.id_str
                + '>'
            );
        });
    }
}

module.exports = {
    listen: listen,
    tweet: tweet
};
