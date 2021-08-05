import * as Discord from 'discord.js';

import { ICommand } from '../interfaces/ICommand';
import generateEmbed from '../utility/embed';

const command: ICommand = {
    command: 'cdn',
    description: 'Link to CDN Wiki Information.',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message) => {
        const embed = generateEmbed('Here is some information about CDN');

        embed.addField('Direct Downloads:', 'https://wiki.altv.mp/wiki/Scripting:CDN_Links');
        embed.addField('How to Setup a CDN:', 'https://wiki.altv.mp/wiki/Tutorial:Setup_CDN');

        msg.reply(embed);
    },
};

export default command;
