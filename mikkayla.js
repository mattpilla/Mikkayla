require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', message => {
    const text = message.content;
    // args: array of [full text, command, everything after command]
    const args = /^([^ ]+)(?: +(.+)$)?/.exec(text);
    // const say = message.channel.send;

    if (text === 'hey') {
        message.channel.send('hiya :)');
    }
});

client.once('ready', () => {
    console.log('hiya :)');
});

client.login(process.env.CLIENT_SECRET);
