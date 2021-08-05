import * as Discord from 'discord.js';
import { ICommand } from '../interfaces/ICommand';

const command: ICommand = {
    command: 'ping',
    description: 'Get a response from the server.',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message) => {
        msg.reply('Pong');
    }
}

export default command;