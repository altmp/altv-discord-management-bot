import * as Discord from 'discord.js';
import generateEmbed from '../utility/embed';

import { ICommand } from '../interfaces/ICommand';

const command: ICommand = {
    command: 'token',
    description: 'Embed which explains how to get a master list token.',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message) => {
        const embed = generateEmbed(
            'Need a Master List Token?',
            `
            You need to send a private message to <@573615407114485760>.

            Send a single message with the content: token.
            
            You must be a member of this Discord for at least 24 hours.
            `
        );

        msg.reply(embed);
    },
};

export default command;
