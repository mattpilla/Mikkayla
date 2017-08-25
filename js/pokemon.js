const helpers = require('../helpers.js');

function getData(channel, args) {
    helpers.requestJSON(
        'http://pokeapi.co/api/v2/pokemon/' + args[1].toLowerCase(),
        function (data) {
            if (data.name) {
                let d = '__#' + data.id + '__  `'
                    + helpers.capitalize(data.name, true) + '` (';
                let types = data.types;
                for (let i = 0; i < types.length; i++) {
                    if (i != 0) {
                        d += ', ';
                    }
                    d += helpers.capitalize(types[i].type.name, true);
                }
                d += ') [';
                let abilities = data.abilities;
                for (let i = 0; i < abilities.length; i++) {
                    if (i != 0) {
                        d += ', ';
                    }
                    d += helpers.capitalize(abilities[i].ability.name, true);
                }
                d += ']\n';
                let statMap = {};
                let stats = data.stats;
                for (let i = 0; i < stats.length; i++) {
                    statMap[stats[i].stat.name] = stats[i].base_stat;
                }
                d += '***HP:*** ' + statMap.hp
                    + ', ***Atk:*** ' + statMap.attack
                    + ', ***Def:*** ' + statMap.defense
                    + ', ***SpA:*** ' + statMap['special-attack']
                    + ', ***SpD:*** ' + statMap['special-defense']
                    + ', ***Spe:*** ' + statMap.speed;
                channel.send(d);
                let spriteType = 'front_default';
                if (args[2] && args[2].toLowerCase() === 'shiny') {
                    spriteType = 'front_shiny';
                }
                channel.send(options={files: [data.sprites[spriteType]]});
            }
        },
        function () {
            channel.send('No data for `' + args[1] + '`');
        }
    );
}

module.exports = {
    getData: getData
};
