var Discord = require("discord.js");
const fs = require('fs');
const auth = require('./auth.json');
var request = require('request');
var mysql = require('mysql');

// Start bot
var bot = new Discord.Client();
bot.login(auth.token);

// Start MySQL
var connection = null;
if (auth.mysql) {
    connection = mysql.createConnection(auth.mysql);
}

// Read all JSON in as objects
var config = getJSON('./conf.json');
var zfgQuotes = getJSON('json/zfgQuotes.json');
var mikkaylaLines = getJSON('json/mikkaylaLines.json', 'utf8');
var items = getJSON('json/item.json', 'utf8');
var tech = getJSON('json/tech.json', 'utf8');

// Bullets left in .roulette
var gun = 0;

/***
 * Message read
 ***/
bot.on('message', (msg) => {
    // Ignore bot shit
    if (msg.author.bot) {
        return;
    }

    // Convenience function for sending messages
    function say(x) {
        msg.channel.sendMessage(x);
    }

    // Get the user's message
    let txt = msg.content;
    // Get each word of command in an array
    let args = txt.split(' ');
    // Is sender admin?
    let admin = (config.admin.indexOf(msg.author.id) !== -1);

    // Ignore everything if sleeping
    if (bot.user.presence.status === 'dnd') {
        if (admin && args[0] === '.wake') {
            if (!args[1] || args[1].includes(bot.user.id)) {
                say('hiya :)');
                bot.user.setStatus('online');
            }
        }
    } else {
        if (txt === '.info') {
            msg.reply('https://github.com/mattpilla/Mikkayla');
        } else if (txt === 'hey') {
            say('shut the fuck up');
        } else if (args[0] === '.zfg') {
            let index = +args[1] - 1;
            if (!Number.isInteger(+index) || index < 0 || index >= zfgQuotes.length) {
                index = randInt(zfgQuotes.length);
            }
            let display = index + 1;
            say('`' + display + ':` ' + zfgQuotes[index]);
        } else if (args[0] == '.razor') {
            let razorOpts = ['skip ', '', 'early '];
            say('You might be able to get ' + read(items) + ' ' + read(razorOpts) + 'with ' + read(tech) + '.');
        } else if (txt.toLowerCase().includes('mikkayla')) {
            say(read(mikkaylaLines));
        } else if (txt === '.roulette') {
            if (!gun) {
                gun = 6;
            }
            say(':grimacing: :gun: ' + gun + ' bullets in the chamber...');
            if (randInt(gun) + 1 == gun) {
                gun = 0;
                say(msg.author + ' is dead :skull_crossbones:');
            } else {
                gun--;
                say('u live.. for now :relieved:');
            }
        }
        /***
         * YouTube Shit
         ***/
        else if (auth.youtube && txt.toLowerCase().includes('youtu')) {
            let vidId = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w-_]+)/.exec(txt);
            if (vidId && vidId.length > 1) {
                // If a youtube video is posted, get JSON details from it
                requestJSON(
                    'https:\/\/www.googleapis.com/youtube/v3/videos?id='
                    + vidId
                    + '&key='
                    + auth.youtube
                    + '&part=snippet,status',
                    function (json) {
                        if (json.items.length) {
                            let vidDetails = json.items[0];
                            // Check for unlisted videos
                            if (vidDetails.status.privacyStatus === 'unlisted') {
                                say('`' + vidDetails.snippet.title + '` is unlisted!');
                            }
                        }
                    }
                );
            }
        }
        /***
         * Admin Shit
         ***/
        else if (admin && txt.charAt(0) === '.') {
            // All commands take an optional parameter to mention the bot
            if (!args[1] || args[1].includes(bot.user.id)) {
                if (args[0] === '.sleep') {
                    say('later');
                    bot.user.setStatus('dnd');
                } else if (args[0] === '.update') {
                    say('give me a sec..');
                    require('child_process').exec('npm install && git pull');
                } else if (args[0] === '.devastate') {
                    say('see ya');
                    setTimeout(function() {
                        process.exit();
                    }, 1000);
                }
            }
        }
    }
});

/***
 * Member left server
 ***/
bot.on('guildMemberRemove', (member) => {
    const guild = member.guild;
    guild.channels.get(guild.id).sendMessage('that fucker finally left');
});

/***
 * Bot initialized
 ***/
bot.on('ready', () => {
    console.log('lets do this shit');
    for (var i = 0; i < config.home.length; i++) {
        bot.channels.get(config.home[i]).sendMessage('hiya :)');
    }
});

// Get random integer from 0 to max-1 inclusive
function randInt(max) {
    return Math.floor(Math.random() * max);
}

// Return random line from a flat JSON
function read(json) {
    return json[randInt(json.length)];
}

// Read JSON file and return object
function getJSON(path) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}

// Get JSON object from url
function requestJSON(url, success, failure) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return success(JSON.parse(body));
        } else {
            return failure(error);
        }
    });
}
