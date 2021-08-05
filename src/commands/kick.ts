import * as Discord from 'discord.js';
import { LOG_TYPES } from '../enums/logTypes';

import { ICommand } from '../interfaces/ICommand';
import { LoggerService } from '../service/logger';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'kick',
    description: '<user> - Kick a player from the server.',
    execute: async (msg: Discord.Message, user: string, reason: string) => {
        const userID = RegexUtility.parseUserID(user);
        const guildMember = msg.guild.members.cache.get(userID);

        if (!guildMember) {
            msg.reply(`${userID} does not exist.`)
            LoggerService.logMessage({ 
                type: LOG_TYPES.MODERATOR, 
                msg: `${msg.author.username}#${msg.author.discriminator} tried to use !kick but user '${userID}' was not found.`
            });
            return;
        }

        // TODO: log the kick

        guildMember.kick(reason)
    }
}

export default command;