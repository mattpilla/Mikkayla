# Mikkayla
Made with [discord.js](https://discord.js.org/)

Create `auth.json` in the root with at least the `token` field if you want to use this (for some ridiculous reason)
```json
{
    "token": "<your bot's connection token>",
    "comment": "everything below here is optional. obviously this line is too",
    "youtube": "<personal YouTube API key>",
    "mysql": {
        "host": "<db host>",
        "user": "<db user>",
        "password": "<db password>",
        "database": "<database>"
    }
}
```
Also update `conf.json` to suit your needs

## Commands
`()` indicates optional parameters, `*` indicates wildcard text, `@` indicates a mention
- `.info`: Links to this repo
- `hey`
- `.zfg (line_number)`: Reads from a list of old ZFG quotes
- `.razor`: Comes up with a Razor theory
- `*mikkayla*`
- `.roulette`: Play Russian roulette without the threat of actually dying
- `*<youtube link>*`: Checks if the video is unlisted

### Admin Only
- `.sleep (@bot)`: Sets bot to DND; ignores everything until woken
- `.wake (@bot)`: Sets bot to online
- `.update (@bot)`: Pulls the latest code from the repo. Recommended to use with [nodemon](https://nodemon.io/) for the server to automatically restart
- `.devastate (@bot)`: Shuts down the bot

## Events
- On initialize: Messages home channel(s) (determined in `conf.json`) `hiya :)`
- On user leave server: Messages default channel of server
