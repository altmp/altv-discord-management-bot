import * as Discord from 'discord.js';

import CommandService from './service/commands';
import { DatabaseService } from './service/database';
import { LoggerService } from './service/logger';
import getPrefix from './utility/prefix';
import getToken from './utility/token';
import DiscordButtons from 'discord-buttons'

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

    if (!msg.content.startsWith(getPrefix())) {
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
    DiscordButtons(client);

    await CommandService.loadCommands();
    await DatabaseService.init();
    
    // Run these After Database Initialization
    await LoggerService.init();
    await client.login(getToken());
    
}

finishConnection();
