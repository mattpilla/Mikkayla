# Mikkayla
Made with [discord.js](https://discord.js.org/)

Create `auth.json` in the root if you want to use this (for some ridiculous reason)
```json
{
    "token": "<your bot's connection token>"
}
```

## Commands
`()` indicates optional parameters, `*` indicates wildcard text, `@` indicates a mention
- `.info`: Links to this repo
- `hey`
- `.zfg (line_number)`: Reads from a list of old ZFG quotes
- `.razor`: Comes up with a Razor theory
- `*mikkayla*`
- `.roulette`: Play Russian roulette without the threat of actually dying
### Admin Only
- `.sleep` (@bot): Sets bot to DND; ignores everything until woken
- `.wake` (@bot): Sets bot to online
- `.update` (@bot): Pulls the latest code from the repo. Recommended to use with [nodemon](https://nodemon.io/) for the server to automatically restart
- `.devastate` (@bot): Shuts down the bot
