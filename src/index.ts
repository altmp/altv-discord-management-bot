import * as Discord from 'discord.js';

import CommandService from './service/commands';
import { DatabaseService } from './service/database';
import { LoggerService } from './service/logger';
import getPrefix from './utility/prefix';
import getToken from './utility/token';
import DiscordButtons from 'discord-buttons'
import { IReactRole } from './interfaces/IReactRole';

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

client.on('clickMenu', async (menu) => {
    let reactRole: IReactRole[] = (await DatabaseService.getData()).reactRoles;

    await menu.reply.think(true);

    reactRole.forEach(value => {
        if (menu.values.includes(value.name)) {
            let addrole = menu.clicker.member.guild.roles.cache.find(role => role.id == value.role);
            menu.clicker.member.roles.add(addrole);
        } else {
            let addrole = menu.clicker.member.guild.roles.cache.find(role => role.id == value.role);
            menu.clicker.member.roles.remove(addrole);
        }
    });

    await menu.reply.edit("I've give you the selected Roles!");
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
