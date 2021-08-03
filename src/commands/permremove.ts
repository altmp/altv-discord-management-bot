import * as Discord from 'discord.js';
import { ICommand } from '../interfaces/ICommand';
import { getGuild } from '../index';
import PermissionService from '../service/permissions';
import RegexUtility from '../utility/regex';
import CommandService from '../service/commands';

const command: ICommand = {
    command: 'permremove',
    description: '[command_name] [role_id] - Remove permission for a command by Role',
    execute: async (msg: Discord.Message, commandName: string, discordRole: string) => {
        discordRole = RegexUtility.parseRoleID(discordRole);

        const guild = getGuild();
        const guildMember = guild.members.cache.get(msg.author.id);
        if (!guildMember) {
            return;
        }

        if (!guildMember.hasPermission('ADMINISTRATOR', { checkAdmin: true, checkOwner: true })) {
            return;
        }

        if (!commandName) {
            return;
        }

        if (!discordRole) {
            return;
        }

        const command = CommandService.getCommand(commandName);
        if (!command) {
            msg.reply(`Command ${commandName} does not exist.`);
            return;
        }

        if (command && command.skipPermissionCheck) {
            msg.reply(`Command ${commandName} is already hard-coded accessible to everyone.`);
            return;
        }

        const result = await PermissionService.remove(commandName, discordRole);
        if (!result) {
            msg.reply(`Command ${commandName} may not exist, or ${discordRole} may not exist.`);
            return;
        }

        let reply = `Command ${commandName} can **no longer** be executed by <@&${discordRole}>.`
        msg.reply(reply);
    }
}

export default command;