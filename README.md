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
    },
    "twitter": {
        "consumer_key": "<consumer key>",
        "consumer_secret": "<consumer secret>",
        "access_token_key": "<access key>",
        "access_token_secret": "<access secret>"
    }
}
```
Also update `conf.json` to suit your needs

## Commands
`<>` indicates required parameters, `()` indicates optional parameters, `*` indicates wildcard text, `@` indicates a mention
- `*mikkayla*`
- `.info`: Links to this repo
- `hey`
- `.colbol`: I chose this command because Colbol is greatly underrepresented in terms of content
- `.pannenkoek`: Motivational poster
- `.zfg (line_number)`: Reads from a list of old ZFG quotes
- `.razor`: Comes up with a Razor theory
- `.roulette`: Play Russian roulette without the threat of actually dying
- `.data <Pokemon name or number> (shiny)`: Gives types, abilities, stats, and sprite of Pokemon. Thanks to [Pokéapi](https://pokeapi.co/). Bless
- `*<youtube link>*`: Checks if the video is unlisted

### Admin Only
- `.sleep (@bot)`: Sets bot to DND; ignores everything until woken
- `.wake (@bot)`: Sets bot to online
- `.update (@bot)`: Pulls the latest code from the repo. Recommended to use with [nodemon](https://nodemon.io/) for the server to automatically restart
- `.devastate (@bot)`: Shuts down the bot
- `.tweet <@bot> <message>`: Tweets message with the account specified in `auth.json`

## Events
- `On initialize`: Messages home channel(s) (determined in `conf.json`)
- `On tweet with zsr hashtags`: Messages the corresponding channel in the [Zelda Science Discord](https://discord.gg/pwsZ6eD) with the tweet
