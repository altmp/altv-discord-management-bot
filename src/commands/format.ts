import * as Discord from 'discord.js';
import generateEmbed from '../utility/embed';

import { ICommand } from '../interfaces/ICommand';

const command: ICommand = {
    command: 'format',
    description: 'Embed which explains how to use code blocks.',
    execute: async (msg: Discord.Message) => {
        const embed = generateEmbed(
            'Please Format Your Code',
            "We have trouble reading code when it's just pasted raw into the channel. Use three back ticks ` to wrap your code."
        );
        embed.setImage('https://i.imgur.com/ti65UUI.png');

        msg.reply(embed);
    },
};

export default command;
