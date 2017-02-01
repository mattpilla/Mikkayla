const helpers = require('../helpers.js');

function join(msg) {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel || voiceChannel.type !== 'voice') {
        return msg.reply('i cant..');
    }
    voiceChannel.join().then(connection => {
        msg.guild.voiceConnection.playFile('audio/oyyyyy.mp3', {volume: helpers.config.volume});
    });
}

module.exports = {
    join: join
};
