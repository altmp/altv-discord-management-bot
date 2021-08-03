import * as Discord from 'discord.js';
import { ICommand } from '../interfaces/ICommand';
import { getGuild } from '../index';
import PermissionService from '../service/permissions';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'permadd',
    description: '[command_name] [role_id] - Add permission to a command by Role.',
    execute: async (msg: Discord.Message, commandName: string, discordRole: string, toggleAllAccess = false) => {
        discordRole = RegexUtility.parseRoleID(discordRole);

        const guild = getGuild();
        const guildMember = guild.members.cache.get(msg.author.id);
        if (!guildMember) {
            return;
        }

        if (!guildMember.hasPermission('ADMINISTRATOR', { checkAdmin: true, checkOwner: true })) {
            msg.reply('no');
            return;
        }

        if (!commandName) {
            msg.reply('no cmd')
            return;
        }

        if (!discordRole) {
            msg.reply('no role');
            return;
        }

        if (toggleAllAccess === 'true') {
            toggleAllAccess = true;
        } else {
            toggleAllAccess = false;
        }

        const result = await PermissionService.add(commandName, discordRole, toggleAllAccess);
        if (!result) {
            msg.reply(`Command ${commandName} may not exist, or ${discordRole} may not exist.`);
            return;
        }

        let reply = `Command ${commandName} can now be executed by <@&${discordRole}>.`
        if (toggleAllAccess) {
            const binding = PermissionService.get(commandName);
            reply += ` All access was also toggled and now set to: ${binding.allAccess}`;
        }

        msg.reply(reply);
    }
}

export default command;