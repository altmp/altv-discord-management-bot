import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';

import { IConfig } from './interfaces/IConfig';

import './enums/collections';
import CommandService from './service/commands';

const PREFIX = '+'
const config: IConfig = dotenv.config().parsed as IConfig;

// if (!config.DATABASE_URL) {
//     throw new Error(`Missing DATABASE_URL from env variables.`);
// }

// if (!config.DATABASE_NAME) {
//     throw new Error(`Missing DATABASE_NAME from env variables.`);
// }

if (!config.DISCORD_BOT_TOKEN) {
    throw new Error(`Missing DISCORD_BOT_TOKEN from env variables.`);
}

// new Database(
//     config.DATABASE_URL,
//     config.DATABASE_NAME,
//     [COLLECTIONS.GENERAL],
//     config.DATABASE_USERNAME,
//     config.DATABASE_PASSWORD
// );

const client = new Discord.Client({ ws: { intents: new Discord.Intents(Discord.Intents.ALL) } });
let guild: Discord.Guild;

client.on('ready', async () => {
    console.log('Started Bot');
    guild = client.guilds.cache.first();
});

client.on('message', (msg: Discord.Message) => {
    if (msg.author.bot) {
        return;
    }

    if (msg.content.includes(`@!`)) {
        return;
    }

    if (!msg.content.startsWith(PREFIX)) {
        return;
    }

    // Parse Command
    const messageContent = msg.content.substring(1);
    if (messageContent.length <= 0) {
        return;
    }

    const args = messageContent.split(' ');
    const commandName = args.shift();
    const commandRef = CommandService.getCommand(commandName);

    // Find Command Index
    if (!commandRef) {
        return;
    }

    // Execute Command with args
    commandRef.execute(msg, ...args);
});

export function getDiscordUser(id: string): Discord.User {
    return client.users.cache.get(id);
}

export function getClient(): Discord.Client {
    return client;
}

export function getGuild(): Discord.Guild {
    return guild;
}

async function finishConnection() {
    client.login(config.DISCORD_BOT_TOKEN);
    await CommandService.loadCommands();
}

finishConnection();
