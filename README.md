# Mikkayla
Made with [discord.js](https://discord.js.org/)

Mikkayla is a very personalized bot specifically designed around my own use.
With voice support, this project now runs best in a Linux environment, with dependencies like ffmpeg and g++. If for some ridiculous reason you want to use this, create `auth.json` and `conf.json` with the example files to guide you.

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

### Music Stuff
Audio files aren't tracked in this repo, so they'll have to be synced manually
- `!join`: Joins voice channel of user and says hello
- `!ok`: Plays DK64 'OK' clip
- `!lol`: Plays King Kutout Laugh

### Admin Only
- `.sleep (@bot)`: Sets bot to DND; ignores everything until woken
- `.wake (@bot)`: Sets bot to online
- `.update (@bot)`: Pulls the latest code from the repo. Recommended to use with [nodemon](https://nodemon.io/) for the server to automatically restart
- `.restart`: Restart bot
- `.devastate (@bot)`: Shuts down the bot
- `.tweet <@bot> <message>`: Tweets message with the account specified in `auth.json`

## Events
- `On initialize`: Messages home channel(s) (determined in `conf.json`)
- `On tweet with zsr hashtags`: Messages the corresponding channel in the [Zelda Science Discord](https://discord.gg/pwsZ6eD) with the tweet

## Terminal
Extras with the terminal in which you run `mikkayla.js`
- `<channel id> <message>`: Send a message to the given channel as Mikkayla
