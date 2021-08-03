import * as Discord from 'discord.js';

import { ICommand } from '../interfaces/ICommand';
import { LoggerService } from '../service/logger';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'logchannel',
    description: '<type> <channel> - Set the log channel and the log channel type.',
    execute: async (msg: Discord.Message, type: string, channel: string) => {
        console.log(msg.channel);

        if (!type || !channel) {

        }

        // LoggerService.setLoggerChannel()
    }
}

export default command;