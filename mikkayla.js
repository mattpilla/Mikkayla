var Discord = require('discord.js');

const helpers = require('./helpers.js');
const pokemon = require('./js/pokemon.js');
const youtube = require('./js/youtube.js');
const twitter = require('./js/twitter.js');

// Start bot
var bot = new Discord.Client();
bot.login(helpers.auth.token);

// Read all JSON in as objects
var zfgQuotes = helpers.getJSON('json/zfgQuotes.json');
var mikkaylaLines = helpers.getJSON('json/mikkaylaLines.json', 'utf8');
var items = helpers.getJSON('json/item.json', 'utf8');
var tech = helpers.getJSON('json/tech.json', 'utf8');

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
        } else if (args[0] === '.zfg') {
            let index = +args[1] - 1;
            if (!Number.isInteger(+index) || index < 0 || index >= zfgQuotes.length) {
                index = helpers.randInt(zfgQuotes.length);
            }
            let display = index + 1;
            say('`' + display + ':` ' + zfgQuotes[index]);
        } else if (args[0] == '.razor') {
            let razorOpts = ['skip ', '', 'early '];
            say('You might be able to get ' + helpers.read(items) + ' ' + helpers.read(razorOpts) + 'with ' + helpers.read(tech) + '.');
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
         * Pokemon Shit
         ***/
        else if (args[0] === '.data' && typeof(args[1] === 'string')) {
            pokemon.getData(msg.channel, args);
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
                    require('child_process').exec('git pull && npm install');
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
bot.on('ready', () => {
    console.log('lets do this shit');
    for (var i = 0; i < helpers.config.home.length; i++) {
        bot.channels.get(helpers.config.home[i]).sendMessage('hiya :)');
    }
    twitter.listen(bot.channels, '#zsroot, #zsrmm, #zsrtww, #zsrtp, #zsrss, #zsrbotw');
});
