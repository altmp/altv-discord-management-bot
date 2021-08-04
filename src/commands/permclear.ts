import * as Discord from 'discord.js';
import { ICommand } from '../interfaces/ICommand';
import { getGuild } from '../index';
import PermissionService from '../service/permissions';
import CommandService from '../service/commands';

const command: ICommand = {
    command: 'permclear',
    description: '[command_name] - Clear all permissions for a command. Default to Admin only.',
    execute: async (msg: Discord.Message, commandName: string) => {
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

        const command = CommandService.getCommand(commandName);
        if (!command) {
            msg.reply(`Command ${commandName} does not exist.`);
            return;
        }

        if (command && command.skipPermissionCheck) {
            msg.reply(`Command ${commandName} is already hard-coded accessible to everyone.`);
            return;
        }

        const result = await PermissionService.clear(commandName);
        if (!result) {
            msg.reply(`Command ${commandName} may not exist.`);
            return;
        }

        let reply = `Command ${commandName} has been reset to **Admin Only**.`;

        const cmd = CommandService.getCommand(commandName);
        if (cmd.skipPermissionCheck) {
            reply += ` However, **ANYONE** can execute this command by default. Toggled in code.`;
        }

        msg.reply(reply);
    }
}

export default command;