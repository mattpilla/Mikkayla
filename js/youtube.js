const helpers = require('../helpers.js');

function getVid(channel, txt) {
    let vidId = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w-_]+)/.exec(txt);
    if (vidId && vidId.length > 1) {
        // If a youtube video is posted, get JSON details from it
        helpers.requestJSON(
            'https:\/\/www.googleapis.com/youtube/v3/videos?id='
            + vidId[1]
            + '&key='
            + helpers.auth.youtube
            + '&part=snippet,status',
            function (json) {
                if (json.items.length) {
                    addUnlisted(json.items[0], vidId, function (success, successMsg) {
                        if (success) {
                            channel.sendMessage(successMsg);
                        }
                    });
                }
            }
        );
    }
}

// Add unlisted video to database
function addUnlisted(vidDetails, vidId, callback) {
    // Check for unlisted videos
    if (vidDetails.status.privacyStatus === 'unlisted') {
        // Add unlisted video to database
        let connection = helpers.connection;
        if (connection) {
            connection.query(
`CREATE TABLE IF NOT EXISTS unlisted (
id VARCHAR(16) NOT NULL COLLATE 'utf8_unicode_ci',
unlisted BIT(1) NOT NULL,
author VARCHAR(50) NULL,
PRIMARY KEY (id)
)
COMMENT='Unlisted YouTube videos'
COLLATE='utf8_unicode_ci'
ENGINE=InnoDB`
            );
            let videoId = helpers.mysql.escape(vidId[1]);
            // Should we add vid to db?
            connection.query(
                'SELECT COUNT(id) AS solution FROM unlisted WHERE id = '
                + videoId
                + ';',
                function (error, results, fields) {
                    if (!results[0].solution) {
                        // Add vid to db
                        connection.query(
                            'INSERT INTO unlisted (id, unlisted, author) VALUES ('
                            + videoId
                            + ', b\'1\', '
                            + helpers.mysql.escape(vidDetails.snippet.channelTitle)
                            + ');',
                            function () {
                                return callback(true, 'Adding unlisted video to database: `' + vidDetails.snippet.title + '`');
                            }
                        );
                    }
                }
            );
        }
    }
    return callback(false);
}

module.exports = {
    getVid: getVid
};
