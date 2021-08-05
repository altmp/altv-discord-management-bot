import * as Discord from 'discord.js';

import { LOG_TYPES } from '../enums/logTypes';
import { ICommand } from '../interfaces/ICommand';
import { LoggerService } from '../service/logger';

const command: ICommand = {
    command: 'purge',
    description: 'Removes the last [amount] of messages in the channel.',
    execute: async (msg: Discord.Message, amount: number) => {
        await (msg.channel as Discord.TextChannel | Discord.NewsChannel).bulkDelete(amount + 1);

        LoggerService.logMessage({
            type: LOG_TYPES.MODERATOR,
            msg: `${msg.author.username}#${msg.author.discriminator} deleted ${amount} messages on ${msg.channel.id}`
        });
    },
};

export default command;
