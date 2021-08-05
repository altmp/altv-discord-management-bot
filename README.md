# alt:V Discord Bot

**What?**

This is the public bot for alt:V that helps manage the server.

# Features

## Permission(s)

There's now a boolean for the ICommand for `skipPermissionCheck`.
If `skipPermissionCheck` is set to `true` it ignores checks.

However, if set to false then nobody can access the command but Admins.

If you add a role to the command through `permadd` anyone with that role can execute that command. This command is hard-locked to Admin(s) as well as the `permremove` and `permclear` commands.

This makes permission(s) very simple and follow a basic hierarchy.

**Hierarchy Being**
```
0. skipPermissionCheck as true
1. Admin
2. Discord Role
```

## Command Registry

Command are individual file(s) and each file has a basic format.

Example **BAN** command.

```ts
import * as Discord from 'discord.js';

import { ICommand } from '../interfaces/ICommand';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'ban',
    description: '<user> - Ban a player from the server.',
    execute: async (msg: Discord.Message, user: string, reason: string) => {
        const guildMember = msg.guild.members.cache.get(RegexUtility.parseUserID(user));
        if (!guildMember) {
            msg.reply('User does not exist.');
            return;
        }

        guildMember.ban({reason})
    }
}

export default command;
```

## Logging

There is a logging service built in that lets you bind a log type to a discord channel.

All commands and data passed through the logger are pushed to that channel.

You can bind any log type with `!bindlogs <type> <channel>`.

```ts
import { LoggerService } from '../service/logger';
import { LOG_TYPES } from '../enums/logTypes';

LoggerService.logMessage({ 
    type: LOG_TYPES.MODERATOR, 
     msg: `Hello from moderator loggings.`
});
```

# Development

**Configuration**

This uses environment variables. You either use a `.env` file or pass environment variables in. Here is the current config.

```
DATABASE_URL=''
DISCORD_BOT_TOKEN=''
PREFIX=''
```

Make sure when you make a discord bot that you turn on all **user intent options in developer settings.**

**Deployment**

You need NodeJS 14+

You need a Discord Bot Token

You need a standalone MongoDB Server

```
npm install
npm run
```

**Development**

```
npm run dev
```
