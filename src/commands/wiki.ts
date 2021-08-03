import * as Discord from 'discord.js';
import generateEmbed from '../utility/embed';

import { ICommand } from '../interfaces/ICommand';

const command: ICommand = {
    command: 'wiki',
    description: 'Embed link to the wiki.',
    execute: async (msg: Discord.Message) => {
        const embed = generateEmbed('Check the Wiki!', 'https://wiki.altv.mp/wiki/Main_Page');
        embed.setThumbnail('https://i.imgur.com/gCfdh2c.png');

        msg.reply(embed);
    },
};

export default command;
