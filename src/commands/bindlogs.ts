import * as Discord from 'discord.js';
import { getGuild } from '../index';
import { LOG_TYPES } from '../enums/logTypes';

import { ICommand } from '../interfaces/ICommand';
import { LoggerService } from '../service/logger';

const command: ICommand = {
    command: 'bindlogs',
    description: '<type> <channel> - Bind a channel to a log type.',
    execute: async (msg: Discord.Message, type: string, channel: string) => {
        if (!type) {
            msg.reply(`Log type was not specified.`);
            return;
        }

        if (!channel) {
            msg.reply(`Channel ID was not specified.`);
            return;
        }

        const guild = getGuild();
        const textChannel = guild.channels.cache.get(channel) as Discord.TextChannel;
        if (!textChannel) {
            msg.reply(`That channel does not exist.`);
            return;
        }

        const result = await LoggerService.setLoggerChannel(channel, type);

        if (!result) {
            msg.reply(`'${type}' is not a valid log type.`);
            return;
        }

        msg.reply(`Successfully bound log(s) of type ${type.toUpperCase()} to <#${channel}>`);
        LoggerService.logMessage({
            type: LOG_TYPES.MODERATOR,
            msg: `${msg.author.username}#${msg.author.discriminator} Bound Channel Type '${type}' to <#${channel}>`
        });
    }
}

export default command;