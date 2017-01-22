const fs = require('fs');
const request = require('request');
const mysql = require('mysql');
const auth = require('./auth.json');
const config = require('./conf.json');

// Start MySQL
var connection = null;
if (auth.mysql) {
    connection = mysql.createConnection(auth.mysql);
}

var randInt = (max) => {
    return Math.floor(Math.random() * max);
}

module.exports = {
    auth: auth,
    config: config,
    connection: connection,
    mysql: mysql,
    // Get random integer from 0 to max-1 inclusive
    randInt: randInt,
    // Capitalize words, and optionally replace dashes with spaces
    capitalize: (str, noDash) => {
        if (noDash) {
            str = str.replace(/-/g, ' ');
        }
        return str.replace(/\b\w/g, l => l.toUpperCase());
    },
    // Return random line from a flat JSON
    read: (json) => {
        return json[randInt(json.length)];
    },
    // Read JSON file and return object
    getJSON: (path) => {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    },
    // Get JSON object from url
    requestJSON: (url, success, failure) => {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return success(JSON.parse(body));
            } else if (failure) {
                return failure(error);
            }
        });
    }
}
