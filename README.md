# miko-bot
(WIP) miko's gang discord server bot

you can self-host by editing the ```config.json``` file. expect some errors, this is a wip project.
```
{
    "token": "your-bot's-token",
    "prefix": "prefix-for-text-commands",
    "mongooseConnectionString": "your-mongodb-connection-string",
    "logchannel": "id-of-the-user-logs-channel",
    "modlogchannel": "id-of-mod-actions-log-channel",
    "ticketlogchannel": "id-of-verification-log-channel",
    "ttsChannel" : "tts-command-channel",
    "strikeslogchannel": "id-of-strikes-log-actions",
    "guild": "id-of-the-guild",
    "clientId": "oauth-client-id-osu!",
    "clientSecret": "oauth-client-id-osu!",
    "osuApiKey": "osu!-apiv1-key"
}
```

bot runs on nodejs v17.9.0 and rust (for osu!api v2 interaction)

before running, use
```
npm i
```

then you run the bot with
```
node index.js
```
this bot uses [a base command handler created by reconlx.](https://github.com/reconlx/djs-base-handler) (thanks!)






