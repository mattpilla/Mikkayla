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
        playClip(msg, 'ok...', 'audio/OK.mp3');
    },
    '!lol': (msg) => {
        playClip(msg, 'lol...', 'audio/kko.mp3');
    },
    '!getout': (msg) => {
        playClip(msg, 'please leave...', 'getout.mp3');
    },
    '!welldone': (msg) => {
        playClip(msg, 'not well done...', 'welldone.mp3');
    }
}

function playClip(msg, failure, file) {
    if (!msg.guild.voiceConnection) {
        return msg.reply(failure);
    }
    return msg.guild.voiceConnection.playFile('audio/' + file, {volume: volume});
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
