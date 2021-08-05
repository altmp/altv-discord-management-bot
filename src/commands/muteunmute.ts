import * as Discord from 'discord.js';
import { LOG_TYPES } from '../enums/logTypes';

import { ICommand } from '../interfaces/ICommand';
import { LoggerService } from '../service/logger';
import MuteService from '../service/mutes';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'unmute',
    description: '<user | id> - Unmute a user by id or tag.',
    execute: async (msg: Discord.Message, user: string) => {
        const userID = RegexUtility.parseUserID(user);
        const guildMember = msg.guild.members.cache.get(userID);

        if (!guildMember) {
            msg.reply(`${userID} does not exist in this guild.`);
            return;
        }

        const result = await MuteService.remove(guildMember.id, false);
        if (!result) {
            msg.reply(`Could not unmute <@!${guildMember.id}>. Probably not muted.`);
            return;
        }

        msg.channel.send(`Unmuted <@!${guildMember.id}>`);
        LoggerService.logMessage({
            type: LOG_TYPES.COMMANDS,
            msg: `<@!${guildMember.id}> got unmuted by <@!${msg.author.id}>!\nUnmuted User ID: ${guildMember.id}, Unmuted By ID: ${msg.author.id}`
        });
    }
}

export default command;