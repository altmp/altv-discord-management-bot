import * as Discord from 'discord.js';

import { ICommand } from '../interfaces/ICommand';
import generateEmbed from '../utility/embed';

const command: ICommand = {
    command: 'cef',
    description: 'Link to CEF Wiki Information.',
    execute: async (msg: Discord.Message) => {
        const embed = generateEmbed(
            'Want to Debug CEF?',
            `
            Check out the documentation on CEF.
            
            https://wiki.altv.mp/wiki/Scripting:CEF_-_Chromium_Embedded_Framework
            `
        );

        msg.reply(embed);
    },
};

export default command;
