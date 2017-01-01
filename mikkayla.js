var Discord = require("discord.js");
const fs = require('fs');
const auth = require('./auth.json');
var bot = new Discord.Client();
bot.login(auth.token);

var zfgQuotes = JSON.parse(fs.readFileSync('json/zfgQuotes.json', 'utf8'));
var mikkaylaLines = JSON.parse(fs.readFileSync('json/mikkaylaLines.json', 'utf8'));
var items = JSON.parse(fs.readFileSync('json/item.json', 'utf8'));
var tech = JSON.parse(fs.readFileSync('json/tech.json', 'utf8'));

var gun = 0;

bot.on('message', msg => {
    if (msg.author.bot) {
        return;
    }

    function say(x) {
        msg.channel.sendMessage(x);
    }

    let args = msg.content.split(' ');
    if (msg.content === '.info') {
        msg.reply('https://github.com/mattpilla/Mikkayla');
    } else if (msg.content === 'hey') {
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
    } else if (msg.content.toLowerCase().includes('mikkayla')) {
        say(read(mikkaylaLines));
    } else if (msg.content === '.roulette') {
        if (!gun) {
            gun = 6;
        }
        say(':grimacing: :gun: ' + gun + ' bullets in the chamber...');
        if (randInt(gun) + 1 == gun) {
            gun = 0;
            say(msg.author + ' is dead :skull_crossbones:');
        } else {
            gun--;
            say('u live.. for now :relieved: :ok_hand:');
        }
    } else if (msg.content === '.update' && msg.author.id === '85521124766539776') {
        require('child_process').exec('git pull');
    } else if (msg.content === '.devastate' && msg.author.id === '85521124766539776') {
        say('see ya');
        setTimeout(function() {
            process.exit();
        }, 1000);
    }
});

bot.on('ready', () => {
    console.log('lets do this shit');
});

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function read(txt) {
    return txt[randInt(txt.length)];
}
