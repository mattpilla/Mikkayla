var Discord = require('discord.js');

const helpers = require('./helpers.js');
const music = require('./js/music.js');
const pokemon = require('./js/pokemon.js');
const youtube = require('./js/youtube.js');
const twitter = require('./js/twitter.js');

// Start bot
var bot = new Discord.Client();
bot.login(helpers.auth.token);

// Take input from terminal
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin
});
rl.on('line', function (line) {
    let txt = /^(\d+) (.+)$/.exec(line);
    if (txt && txt.length > 2) {
        bot.channels.get(txt[1]).sendMessage(txt[2]);
    }
});

// Read all JSON in as objects
var zfgQuotes = helpers.getJSON('json/zfgQuotes.json');
var gamelist = helpers.getJSON('json/gamelist.json');
var mikkaylaLines = helpers.getJSON('json/mikkaylaLines.json', 'utf8');
var items = helpers.getJSON('json/item.json', 'utf8');
var tech = helpers.getJSON('json/tech.json', 'utf8');

// Bullets left in .roulette
var gun = 0;

/***
 * Message read
 ***/
bot.on('message', msg => {
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
    let admin = (helpers.config.admin.indexOf(msg.author.id) !== -1);

    // Ignore everything if sleeping
    if (bot.user.presence.status === 'dnd') {
        if (admin && args[0] === '.wake') {
            if (!args[1] || args[1].includes(bot.user.id)) {
                say('hiya :)');
                bot.user.setStatus('online');
            }
        }
    } else {
        if (txt.toLowerCase().includes('mikkayla')) {
            say(helpers.read(mikkaylaLines));
        }
        if (txt === '.info') {
            msg.reply('https://github.com/mattpilla/Mikkayla');
        } else if (txt === 'hey') {
            say('shut the fuck up');
        } else if (txt === '.colbol') {
            msg.channel.sendFile('images/colbol.JPG');
        } else if (txt === '.pannenkoek') {
            msg.channel.sendFile('images/pannenkoek.png');
        } else if (txt === '.gg') {
            msg.channel.sendFile('images/gg.png', 'gg.png', 'Ever plan on buying @SteelSeries gear? the code "goronguy10" will grant you a 10% discount! Game on.');
        } else if (args[0] === '.zfg') {
            let index = +args[1] - 1;
            if (!Number.isInteger(+index) || index < 0 || index >= zfgQuotes.length) {
                index = helpers.randInt(zfgQuotes.length);
            }
            let display = index + 1;
            say('`' + display + ':` ' + zfgQuotes[index]);
        } else if (args[0] === '.razor') {
            let razorOpts = ['skip ', '', 'early '];
            say('You might be able to get ' + helpers.read(items) + ' ' + helpers.read(razorOpts) + 'with ' + helpers.read(tech) + '.');
        } else if (args[0] === '.gamelist') {
            let index = +args[1] - 1;
            let gameCount = gamelist.length;
            switch (args[1]) {
                case undefined:
                    let fullList = '```\n';
                    for (let i = 0; i < gameCount; i++) {
                        fullList += (i + 1) + ': ' + gamelist[i] + '\n';
                    }
                    say(fullList + '```');
                    break;
                case 'random':
                    index = helpers.randInt(gameCount);
                default:
                    if (Number.isInteger(index) && index >= 0 && index < gameCount) {
                        say('`' + (index + 1) + ':` ' + gamelist[index]);
                    }
                    break;
            }
        } else if (txt === '.roulette') {
            if (!gun) {
                gun = 6;
            }
            say(':grimacing: :gun: ' + gun + ' bullets in the chamber...');
            if (helpers.randInt(gun) + 1 == gun) {
                gun = 0;
                say(msg.author + ' is dead :skull_crossbones:');
            } else {
                gun--;
                say('u live.. for now :relieved:');
            }
        }
        /***
         * Color Shit
         ***/
        else if (/^#[0-9a-fA-F]{6}$/.test(txt)) {
            let color = txt.substr(1);
            helpers.requestJSON(
                'http://thecolorapi.com/id?hex=' + color,
                function (data) {
                    msg.channel.sendFile(
                        `https://dummyimage.com/40x40/${color}/${color}.jpg`,
                        color + '.jpg',
                        '`' + data.hex.value + '` ' + data.rgb.value + '\n**' + data.name.value + '** `(' + (data.name.exact_match_name ? 'exact' : data.name.closest_named_hex) + ')`'
                    );
                }
            );
        }
        /***
         * Pokemon Shit
         ***/
        else if (args[0] === '.data' && typeof(args[1] === 'string')) {
            pokemon.getData(msg.channel, args);
        }
        /***
         * Music Shit
         ***/
        else if (txt.charAt(0) === '!') {
            music.exec(msg);
        }
        /***
         * Urban Dictionary Shit
         ***/
        else if (args[0] === '.define' && args.length > 1) {
            let term = txt.substr(8);
            helpers.requestJSON(
                'http://api.urbandictionary.com/v0/define?term='
                    + encodeURIComponent(term),
                function (data) {
                    if (data.list.length) {
                        let result = data.list[0];
                        say('**' + result.word + '**: ' + result.definition
                            + '\n`' + result.example + '` \n:+1::skin-tone-5:'
                            + result.thumbs_up + ' :-1::skin-tone-5:'
                            + result.thumbs_down + ' <' + result.permalink + '>'
                        );
                    } else {
                        say('no results for **' + term + '**');
                    }
                }
            );
        }
        /***
         * Weather Shit
         ***/
        else if (args[0] === '.weather' && helpers.auth.openweather) {
            if (/^\d{5}$/.test(args[1])) {
                helpers.requestJSON(
                    'http://api.openweathermap.org/data/2.5/forecast?zip='
                        + args[1]
                        + ',us&units=imperial&appid='
                        + helpers.auth.openweather,
                    function (data) {
                        if (data.cod === '200') {
                            let datum = data.list[0];
                            say('weather for `' + args[1] + '` (*'
                                + data.city.name + '*): **' + Math.round(datum.main.temp) + '°**F [humidity: **' + datum.main.humidity + '**%, wind: **' + Math.round(datum.wind.speed) + '**mph] *' + datum.weather[0].description + '*');
                        }
                        else {
                            say('invalid zip..');
                        }
                    }
                );
            } else {
                say('i need a US zip code..');
            }
        }
        /***
         * Twitch Shit
         ***/
        else if (args[0] === '.info' && typeof(args[1] === 'string') && helpers.auth.twitch) {
            helpers.requestJSON(
                'https://api.twitch.tv/kraken/channels/'
                + args[1]
                + '?client_id='
                + helpers.auth.twitch,
                function (data) {
                    if (data.error) {
                        say('i dont have info on ' + args[1]);
                    } else {
                        say('`' + data.display_name + '` :bust_in_silhouette: '
                            + data.followers + ' :eye: '
                            + data.views + ' <'
                            + data.url + '>\nlast live with *'
                            + (data.status ? data.status : '<no title>')
                            + '* in **'
                            + (data.game ? data.game : '<no game>') + '**'
                        );
                        if (data.logo) {
                            msg.channel.sendFile(data.logo);
                        }
                    }
                },
                function (err) {
                    say('i dont have info on ' + args[1]);
                }
            );
        }
        /***
         * YouTube Shit
         ***/
        else if (helpers.auth.youtube && txt.toLowerCase().includes('youtu')) {
            youtube.getVid(msg.channel, txt);
        }
        /***
         * Admin Shit
         ***/
        else if (admin && txt.charAt(0) === '.') {
            // All commands take a parameter to mention the bot
            if (!args[1] || args[1].includes(bot.user.id)) {
                if (args[0] === '.sleep') {
                    say('later');
                    bot.user.setStatus('dnd');
                } else if (args[0] === '.update') {
                    say('give me a sec..');
                    require('child_process').exec('git pull');
                } else if (args[0] === '.restart') {
                    require('child_process').exec('touch mikkayla.js');
                } else if (args[0] === '.devastate') {
                    say('see ya');
                    setTimeout(function() {
                        process.exit();
                    }, 1000);
                } else if (args[0] === '.tweet' && args.length > 2) {
                    let status = /> (.+)$/.exec(txt);
                    if (status && status.length > 1) {
                        twitter.tweet(msg.channel, status[1]);
                    }
                }
            }
        }
    }
});

/***
 * Bot initialized
 ***/
bot.once('ready', () => {
    console.log('lets do this shit');
    helpers.msgHome(bot.channels, 'hiya :)');
    twitter.listen(bot.channels);
});

/***
 * Prevent shit fuckery on crash
 ***/
process.on('uncaughtException', err => {
    helpers.msgHome(bot.channels, '```markdown\n#' + err + '```');
    console.log('well, fuck: ' + err);
});
