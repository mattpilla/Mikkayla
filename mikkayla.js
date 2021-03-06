var Discord = require('discord.js');

const helpers = require('./helpers.js');
const music = require('./js/music.js');
const speedrun = require('./js/speedrun.js');
const pokemon = require('./js/pokemon.js');
const youtube = require('./js/youtube.js');
const twitter = require('./js/twitter.js');
const request = require('request');

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
        bot.channels.get(txt[1]).send(txt[2]);
    }
});

// Read all JSON in as objects
var zfgQuotes = helpers.getJSON('json/zfgQuotes.json');
var gamelist = helpers.getJSON('json/gamelist.json');
var ssbmRanks = helpers.getJSON('json/SSBMRank2018.json');
var pgrRanks = helpers.getJSON('json/PGRv5.json');
var mikkaylaLines = helpers.getJSON('json/mikkaylaLines.json');
var items = helpers.getJSON('json/item.json');
var tech = helpers.getJSON('json/tech.json');
var holidays = helpers.getJSON('json/holidays.json');

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
        msg.channel.send(x);
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
        } else if (args[0] === '.random' && Number.isInteger(+args[1]) && args[1] > 1) {
            say(helpers.randInt(args[1]) + 1);
        } else if (txt === '.colbol') {
            msg.channel.send(options={files: ['images/colbol.JPG']});
        } else if (txt === '.pannenkoek') {
            msg.channel.send(options={files: ['images/pannenkoek.png']});
        } else if (txt === '.inspiration') {
            request.get('http://inspirobot.me/api?generate=true', (error, response, body) => {
                if (!error) {
                    msg.channel.send(options={files: [body]});
                }
            });
        } else if (args[0] === '.like') {
            let chan = bot.channels.get(args[1]);
            if (!chan) {
                chan = msg.channel;
            }
            chan.send(options={files: ['images/rrlike.JPG']});
        } else if (txt === '.gg') {
            msg.channel.send('Ever plan on buying @SteelSeries gear? the code "goronguy10" will grant you a 10% discount! Game on.', {files: ['images/gg.png']});
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
                    let fullList = '';
                    for (let i = 0; i < gameCount; i++) {
                        fullList += '`' + (i + 1) + ':` ' + gamelist[i] + '\n';
                    }
                    say(fullList);
                    break;
                case 'add':
                    let game = txt.substr(14);
                    gamelist.push(game);
                    helpers.saveJSON('gamelist', gamelist, () => {
                        say(`game \`#${gameCount + 1}\` added: **${game}**`);
                    });
                    break;
                case 'remove':
                    let i = +args[2] - 1;
                    if (Number.isInteger(i) && i >= 0 && i < gameCount) {
                        let game = gamelist[i];
                        gamelist.splice(i, 1);
                        helpers.saveJSON('gamelist', gamelist, () => {
                            say(`game \`#${i + 1}\` removed: **${game}**`);
                        });
                    }
                    break;
                case 'random':
                    index = helpers.randInt(gameCount);
                default:
                    if (Number.isInteger(index) && index >= 0 && index < gameCount) {
                        say('`' + (index + 1) + ':` ' + gamelist[index]);
                    }
                    break;
            }
        } else if ((args[0] === '.rank' || args[0] === '.pgr') && args.length > 1) {
            let pgr = args[0] === '.pgr';
            let ranks = pgr ? pgrRanks : ssbmRanks;
            let query = txt.substr(pgr ? 5 : 6);
            let queryLc = query.toLowerCase();
            if (queryLc === 'mang0') {
                // lmao...
                queryLc = 'mango';
            }
            let rankNum = Number.parseInt(query);
            let record;
            let fuzzy = false; // Was the query an include?
            if (rankNum && rankNum > 0 && rankNum <= 100 && (!pgr || rankNum <= 50)) {
                record = ranks[rankNum - 1];
            } else {
                record = ranks.find(rank => rank.name.toLowerCase() === queryLc);
                if (!record) {
                    record = ranks.find(rank => rank.name.toLowerCase().includes(queryLc));
                    fuzzy = !!record; // set fuzzy to true if matched here
                }
            }
            if (record) {
                say(`${fuzzy ? 'did you mean...\n' : ''}__${pgr ? 'PGRv5' : 'SSBMRank2018'}__ #${record.rank}: ${record.flag} **${record.name}** [${record.mains.join(', ')}] \`Score: ${record.score} (${record.delta})\``);
            } else {
                say('no results for **' + query + '**');
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
        } else if (txt === '.roster') {
            say('```\nDoc\nMario\nLuigi\nBowser\nPeach\nYoshi\nDK\nCaptain Falcon\nGanondorf\nFalco\nFox\nNess\nIce Climbers\nKirby\nSamus\nZelda\nSheik\nLink\nYoung Link\nPichu\nPikachu\nJigglypuff\nMewtwo\nG&W\nMarth\nRoy```');
        } else if (args[0] === '.holiday') {
            let today = new Date(args[1]);
            if (isNaN(today.getTime())) {
                today = new Date();
            }
            let dayString = today.toISOString().substr(0, 10);
            var list = '```\n';
            if (holidays[dayString] !== undefined) {
                for (let i = 0; i < holidays[dayString].length; i++) {
                    list += holidays[dayString][i] + '\n';
                }
                say('`' + dayString + '`\n' + list + '```');
            } else {
                request.get(`https://www.checkiday.com/${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`, (error, response, body) => {
                    body.replace(/>([^><]+)<\/a><\/h2><\/div><a/gm, (match, m1) => {
                        if (!m1.toLowerCase().startsWith('the start of')) {
                            list += m1 + '\n'
                        }
                    });
                    say('`' + today.toString() + '`\n'
                        + list + '```');
                });
            }
        }
        /***
         * Speedrun Shit
         ***/
        else if (args[0] === '.wr' && args.length > 1) {
            speedrun.getWR(msg.channel, args);
        }
        /***
         * Color Shit
         ***/
        else if (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(txt) || /^rgb\([\d, ]+\)$/.test(txt)) {
            let type = 'rgb';
            let color = txt;
            if (txt[0] === '#') {
                type = 'hex';
                color = txt.substr(1);
            }
            helpers.requestJSON(
                `http://thecolorapi.com/id?${type}=${color}`,
                data => {
                    msg.channel.send(
`\`${data.hex.value}\` ${data.rgb.value}
**${data.name.value}** \`(${data.name.exact_match_name ? 'exact' : data.name.closest_named_hex})\``,
                        {files: [`https://dummyimage.com/40x40/${color}/${color}.jpg`]}
                    );
                },
                () => {
                    say('`rgb(<0-255>, <0-255>, <0-255>)`');
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
         * Image Shit
         ***/
        else if (args[0] === '.image' && args.length > 1) {
            let term = txt.substr(7)
            helpers.requestJSON(
                `https://www.contextualwebsearch.com/api/Search/GetImageSearch?q=${encodeURIComponent(term)}&pageNumber=1&pageSize=35&autoCorrect=false`,
                function (data) {
                    let images = data.images.filter(image => {
                        let ext = image.imageUrl.toLowerCase().substr(-3);
                        return ext === 'png' || ext === 'jpg' || ext === 'gif';
                    });
                    if (images.length) {
                        msg.channel.send(options={files: [helpers.read(images).imageUrl]});
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
                            msg.channel.send(
                                `weather for \`${args[1]}\` (*${data.city.name}*): **${Math.round(datum.main.temp)}°**F [humidity: **${datum.main.humidity}**%, wind: **${Math.round(datum.wind.speed)}**mph] *${datum.weather[0].description}*`, {files: [`http://openweathermap.org/img/w/${datum.weather[0].icon}.png`]});
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
        else if (args[0] === '.twitch' && typeof(args[1] === 'string') && helpers.auth.twitch) {
            helpers.requestJSON(
                'https://api.twitch.tv/kraken/channels/'
                + args[1]
                + '?client_id='
                + helpers.auth.twitch,
                function (data) {
                    if (data.error) {
                        say('i dont have info on ' + args[1]);
                    } else {
                        let options = data.logo ? {files: [data.logo]} : null;
                        msg.channel.send('`' + data.display_name + '` :bust_in_silhouette: '
                            + data.followers + ' :eye: '
                            + data.views + ' <'
                            + data.url + '>\nlast live with *'
                            + (data.status ? data.status : '<no title>')
                            + '* in **'
                            + (data.game ? data.game : '<no game>') + '**',
                            options
                        );
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
                    require('child_process').exec(`touch ${__filename}`);
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
 * Entrance themes
 ***/
function playSound(sound, channelId) {
    let channels = bot.voiceConnections.array();
    for (let i = 0; i < channels.length; i++) {
        let voice = channels[i];
        if (voice && voice.channel.id === channelId) {
            voice.playFile(sound, {volume: helpers.config.volume});
        }
    }
}
bot.on('voiceStateUpdate', (old, current) => {
    if (old.voiceChannelID !== current.voiceChannelID) {
        if (current.voiceChannelID) {
            playSound(`audio/themes/${current.user.id}.mp3`, current.voiceChannelID);
        } else {
            playSound('audio/oak/oak0.mp3', old.voiceChannelID);
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
    let voiceChans = helpers.config.voice;
    if (voiceChans) {
        for (let i = 0; i < voiceChans.length; i++) {
            bot.channels.get(voiceChans[i]).join();
        }
    }
});

/***
 * Prevent shit fuckery on crash
 ***/
process.on('uncaughtException', err => {
    helpers.msgHome(bot.channels, '```markdown\n#' + err + '```');
    console.log('well, fuck: ' + err);
});
