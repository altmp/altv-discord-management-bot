import * as Discord from 'discord.js';
import { ICommand } from '../interfaces/ICommand';
import { getGuild } from '../index';
import PermissionService from '../service/permissions';
import CommandService from '../service/commands';
import generateEmbed from '../utility/embed';
import getPrefix from '../utility/prefix';

const command: ICommand = {
    command: 'perminfo',
    description: '[command_name] - Get info about command permissions.',
    execute: async (msg: Discord.Message, commandName: string) => {
        const guild = getGuild();
        const guildMember = guild.members.cache.get(msg.author.id);
        if (!guildMember) {
            return;
        }

        if (!commandName) {
            return;
        }

        const command = CommandService.getCommand(commandName);
        if (!command) {
            msg.reply(`${commandName} does not exist.`);
            return;
        }

        const commandBinding = PermissionService.get(commandName);
        let description = 'Here is who can execute this command.\n\n'
        description += `**Roles:**\n`;

        let addedInfo = false;
        if (command.skipPermissionCheck) {
            description += `everyone\n`;
            addedInfo = true;
        }

        if (commandBinding) {
            if (commandBinding.allAccess && !command.skipPermissionCheck) {
                description += `everyone\n`;
                addedInfo = true;
            }

            if (commandBinding.roles.length >= 1) {
                for(let i = 0; i < commandBinding.roles.length; i++) {
                    description += `<@&${commandBinding.roles[i]}>\n`;
                }
    
                addedInfo = true;
            }
        }
       
        if (!addedInfo) {
            description += `Admin(s) Only`;
        }

        const embed = generateEmbed(`${getPrefix()}${commandName}`, description);
        msg.reply(embed);
    }
}

export default command;