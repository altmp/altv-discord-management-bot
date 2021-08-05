import * as Discord from 'discord.js';

import CommandService from './service/commands';
import { DatabaseService } from './service/database';
import { LoggerService } from './service/logger';
import getPrefix from './utility/prefix';
import getToken from './utility/token';
import DiscordButtons from 'discord-buttons'
import { IReactRole } from './interfaces/IReactRole';
import PermissionService from './service/permissions';
import { checkLockdownChannel } from './commands/lockdown';
import MuteService from './service/mutes';
import { LOG_TYPES } from './enums/logTypes';

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

    // Check Permission
    if (!commandRef.skipPermissionCheck) {
        if (!PermissionService.checkPermission(msg.author, commandRef.command)) {
            return;
        }
    }

    commandRef.execute(msg, ...args);
});

client.on('guildMemberAdd', async (member) => { 
    MuteService.checkNewUser(member.id);
});

client.on('clickMenu', async (menu) => {
    if (menu.id != 'RoleSelect') return;
    let reactRole: IReactRole[] = (await DatabaseService.getData()).reactRoles;

    await menu.reply.think(true);

    reactRole.forEach(value => {
        if (menu.values.includes(value.name)) {
            let addrole = menu.clicker.member.guild.roles.cache.find(role => role.id == value.role);
            if (addrole == undefined || addrole == null) {
                console.warn("Dropdown Role not found! ID: " + value.role);
                return;
            }
            menu.clicker.member.roles.add(addrole);
        } else {
            let removerole = menu.clicker.member.guild.roles.cache.find(role => role.id == value.role);
            if (removerole == undefined || removerole == null) {
                console.warn("Dropdown Role not found! ID: " + value.role);
                return;
            }
            menu.clicker.member.roles.remove(removerole);
        }
    });

    await menu.reply.edit("Roles were updated successfully.");
});

client.on('messageDelete', (message: Discord.Message | Discord.PartialMessage) => {
    LoggerService.logMessage({
        type: LOG_TYPES.DELETED,
        msg: `Author: <@${message.author.id}>\n\n${message.content}`
    });
});

function handleTick() {
    setInterval(async () => {
        await checkLockdownChannel();
        await MuteService.tick();
    }, 2500);
}

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
    await PermissionService.init();
    await MuteService.init();
    await client.login(getToken());
    handleTick();
}

finishConnection();
