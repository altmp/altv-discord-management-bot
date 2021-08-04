import * as Discord from 'discord.js';

import { ICommand } from '../interfaces/ICommand';

const command: ICommand = {
    command: 'purge',
    description: 'Removes the last [amount] of messages in the channel.',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message, amount: number) => {
        await (msg.channel as Discord.TextChannel | Discord.NewsChannel).bulkDelete(amount + 1);
    },
};

export default command;
