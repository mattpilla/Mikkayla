const helpers = require('../helpers.js');

function getWR(channel, args) {
    let game = encodeURIComponent(args[1]);
    let category = 'any';
    if (args[2]) {
        // get category in uri component form, ex: "any% no rba/ww" = "any_no_rbaww"
        category = args.splice(2).join('_').replace(/[^A-Za-z0-9_]/g, '');
    }
    helpers.requestJSON(
        `http://www.speedrun.com/api/v1/leaderboards/${game}/category/${category}?top=1`,
        function (data) {
            let run = data.data.runs[0].run;
            helpers.requestJSON(
                run.players[0].uri,
                function (d) {
                    // get time string. this is really shitty but idc
                    let h = '0';
                    let m = '00';
                    let s = '00';
                    let x = '';
                    let y = run.times.primary;
                    for (let i = 2; i < y.length; i++) {
                        switch (y[i]) {
                            case 'H':
                                h = x;
                                x = '';
                                break;
                            case 'M':
                                if (x.length < 2) {
                                    x = '0' + x;
                                }
                                m = x;
                                x = '';
                                break;
                            case 'S':
                                if (x.length < 2) {
                                    x = '0' + x;
                                }
                                s = x;
                                x = '';
                                break;
                            default:
                                x += y[i];
                                break;
                        }
                    }
                    let names = d.data.names;
                    let runner = names.international + (names.japanese ? ' (' + names.japanese + ')' : '');
                    channel.sendMessage(`**${h}:${m}:${s}** by *${runner}* on *${run.date}*\n${run.weblink}`);
                }
            );
        },
        function (data) {
            channel.sendMessage('.wr `game` `category`\n'
                + '`game` and `category` use the (case-sensitive) abbreviations on https://speedrun.com');
        }
    );
}

module.exports = {
    getWR: getWR
};
