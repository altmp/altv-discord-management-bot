import * as Discord from 'discord.js';
import generateEmbed from '../utility/embed';

import { ICommand } from '../interfaces/ICommand';

const command: ICommand = {
    command: 'search',
    description: 'Embed telling someone to search Discord.',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message) => {
        const embed = generateEmbed(
            'Searching Discord',
            'Experts and newbies agree that the Discord search will most often answer your question.'
        );
        embed.setImage('https://i.imgur.com/tXOGCQJ.png');

        msg.reply(embed);
    },
};

export default command;
