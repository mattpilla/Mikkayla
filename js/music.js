const helpers = require('../helpers.js');
let volume = helpers.config.volume;

const commands = {
    '!join': (msg) => {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel || voiceChannel.type !== 'voice') {
            return msg.reply('i cant..');
        }
        voiceChannel.join().then(connection => {
            msg.guild.voiceConnection.playFile('audio/oyyyyy.mp3', {volume: volume});
        });
    },
    '!ok': (msg) => {
        if (!msg.guild.voiceConnection) {
            return msg.reply('ok...');
        }
        msg.guild.voiceConnection.playFile('audio/OK.mp3', {volume: volume});
    }
}

function exec(msg) {
    let args = msg.content.split(' ');
    if (commands[args[0]] !== undefined) {
        commands[args[0]](msg);
    }
}

module.exports = {
    exec: exec
};
