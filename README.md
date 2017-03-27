# Mikkayla
Made with [discord.js](https://discord.js.org/)

Mikkayla is a very personalized bot specifically designed around my own use.
With voice support, this project now runs best in a Linux environment, with dependencies like ffmpeg and g++. If for some ridiculous reason you want to use this, create `auth.json` and `conf.json` with the example files to guide you.

## Commands
`<>` indicates required parameters, `()` indicates optional parameters, `*` indicates wildcard text, `@` indicates a mention
- `*mikkayla*`: friendly message
- `.info`: Links to this repo
- `hey`: says hi
- `.colbol`: I chose this command because Colbol is greatly underrepresented in terms of content
- `.pannenkoek`: Motivational poster
- `.like (channel id)`: Give that message a like! Optionally, specify a channel to send it to
- `.gg`: Game on.
- `.zfg`: Random selection from a list of old ZFG quotes
  - `.zfg (line number)`: Reads specific old ZFG quote
- `.razor`: Comes up with a Razor theory
- `.gamelist`: Gives a list of games to potentially play
  - `.gamelist (add <game name>)`: Adds game to end of list
  - `.gamelist (remove <number>)`: Removes specific game from list
  - `.gamelist (random)`: Gives random game from list
  - `.gamelist (number)`: Gives specific game from list
- `.roulette`: Play Russian roulette without the threat of actually dying
- `.wr <game> (category)`: Gives world record for game and category from [speedrun.com API](https://github.com/speedruncom/api)
- `#<hex color>`: Gives color info
- `.data <Pokemon name or number> (shiny)`: Gives types, abilities, stats, and sprite of Pokemon. Thanks to [Pokéapi](https://pokeapi.co/). Bless
- `.define <search term>`: Gives top definition of term from Urban Dictionary
- `.weather <zip code>`: Gives the approximate temperature for the US zip code
- `.twitch <twitch name>`: Gives channel info for the given twitch user
- `*<youtube link>*`: Checks if the video is unlisted

### Music Stuff
Audio files aren't tracked in this repo, so they'll have to be synced manually
- `!join`: Joins voice channel of user and says hello
- `!ok`: Plays DK64 "OK" clip
- `!lol`: Plays King Kutout Laugh
- `!getout`: Plays DK64 "GET OUT" clip
- `!welldone`: Plays DK64 "WELL DONE" clip

### Admin Only
- `.sleep (@bot)`: Sets bot to DND; ignores everything until woken
- `.wake (@bot)`: Sets bot to online
- `.update (@bot)`: Pulls the latest code from the repo. Recommended to use with [nodemon](https://nodemon.io/) for the server to automatically restart
- `.restart (@bot)`: Restart bot
- `.devastate (@bot)`: Shuts down the bot
- `.tweet <@bot> <message>`: Tweets message with the account specified in `auth.json`

## Events
- `On initialize`: Messages home channel(s) (determined in `conf.json`)
- `On tweet with zsr hashtags`: Messages the corresponding channel in the [Zelda Science Discord](https://discord.gg/pwsZ6eD) with the tweet
- `On user join voice`: Plays their entrance theme, if they have one

## Terminal
Extras with the terminal in which you run `mikkayla.js`
- `<channel id> <message>`: Send a message to the given channel as Mikkayla
