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
        playClip(msg, 'ok...', 'OK.mp3');
    },
    '!lol': (msg) => {
        let file = 'duel.mp3';
        if (helpers.randInt(75)) {
            file = 'kko.mp3';
        }
        playClip(msg, 'lol...', file);
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
    msg.guild.voiceConnection.playFile('audio/' + file, {volume: volume});
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
