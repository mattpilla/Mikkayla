var Twit = require('twit');

const helpers = require('../helpers.js');
var tweetlist = helpers.getJSON('json/tweetlist.json');

// Connect to Twitter
var twitApi = null;
if (helpers.auth.twitter) {
    twitApi = new Twit(helpers.auth.twitter);
}

// Ugliest and dumbest shit of my life
function listen(channels) {
    if (twitApi) {
        // Get zsr hashtags from config
        let zsr = helpers.config.zsr;
        let hashtags = Object.keys(zsr).join(', ');

        // Get missed tweets since yesterday
        let d = new Date();
        d.setDate(d.getDate() - 1);
        let yesterday = d.toISOString().substr(0, 10);
        twitApi.get('search/tweets', {q: `${Object.keys(zsr).join(' OR ')} since:${yesterday}`, tweet_mode: 'extended'}, (error, data, response) => {
            if (error) {
                throw error;
            }
            let statuses = data.statuses;
            if (statuses) {
                for (let i = 0; i < statuses.length; i++) {
                    let tweet = statuses[i];
                    if (tweet.full_text != null) {
                        tweet.text = tweet.full_text;
                    }
                    if (!tweetlist.includes(tweet.id_str) && tweet.text != null && tweet.text.indexOf('RT ') !== 0 && !tweet.retweet_count && !tweet.favorite_count) {
                        let userId = tweet.user.id_str;
                        let blacklist = helpers.config.blacklist;
                        let blacklisted = false;
                        // Ignore tweet if from blacklisted user
                        for (let i = 0; i < blacklist.length; i++) {
                            if (userId === blacklist[i].id) {
                                blacklisted = true;
                            }
                        }
                        if (blacklisted) {
                            continue;
                        }
                        let tags = tweet.entities.hashtags;
                        let taglist = [];
                        for (let i = 0; i < tags.length; i++) {
                            let tag = '#' + tags[i].text.toLowerCase();
                            if (!taglist.includes(tag)) {
                                taglist.push(tag);
                                let tagChannels = zsr[tag];
                                if (tagChannels !== undefined) {
                                    for (let j = 0; j < tagChannels.length; j++) {
                                        let user = tweet.user.screen_name;
                                        let channel = channels.get(tagChannels[j]);
                                        if (channel !== undefined) {
                                            channel.send(
                                                `\`${tag} tweet by ${user} on ${new Date(tweet.created_at).toUTCString()}\`: ${tweet.text}\n<https://twitter.com/${user}/status/${tweet.id_str}>`
                                            );
                                            tweetlist.push(tweet.id_str);
                                            helpers.saveJSON('tweetlist', tweetlist, () => console.log('tweet added'));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Get tweets from stream
        var stream = twitApi.stream('statuses/filter', {track: hashtags});
        stream.on('tweet', tweet => {
            if (tweet.extended_tweet != null) {
                tweet.entities.hashtags = tweet.entities.hashtags.concat(tweet.extended_tweet.entities.hashtags);
                tweet.text = tweet.extended_tweet.full_text;
            }
            if (tweet.text != null && tweet.text.indexOf('RT ') !== 0 && !tweet.retweet_count && !tweet.favorite_count) {
                let userId = tweet.user.id_str;
                let blacklist = helpers.config.blacklist;
                // Ignore tweet if from blacklisted user
                for (let i = 0; i < blacklist.length; i++) {
                    if (userId === blacklist[i].id) {
                        helpers.msgHome(channels, 'blacklisted tweet');
                        return;
                    }
                }
                let tags = tweet.entities.hashtags;
                let taglist = [];
                for (let i = 0; i < tags.length; i++) {
                    let tag = '#' + tags[i].text.toLowerCase();
                    if (!taglist.includes(tag)) {
                        taglist.push(tag);
                        let tagChannels = zsr[tag];
                        if (tagChannels !== undefined) {
                            for (let j = 0; j < tagChannels.length; j++) {
                                let user = tweet.user.screen_name;
                                let channel = channels.get(tagChannels[j]);
                                if (channel !== undefined) {
                                    channel.send(
                                        `\`New ${tag} tweet by ${user}\`: ${tweet.text}\n<https://twitter.com/${user}/status/${tweet.id_str}>`
                                    );
                                    tweetlist.push(tweet.id_str);
                                    helpers.saveJSON('tweetlist', tweetlist, () => console.log('tweet added'));
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}

function tweet(channel, status) {
    if (twitApi) {
        twitApi.post('statuses/update', {status: status},  function (error, tweet, response) {
            if (error) {
                throw error;
            }
            channel.send(
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
