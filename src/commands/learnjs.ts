import * as Discord from 'discord.js';
import generateEmbed from '../utility/embed';

import { ICommand } from '../interfaces/ICommand';

const command: ICommand = {
    command: 'learnjs',
    description: 'Embed links to help with learning JS.',
    execute: async (msg: Discord.Message) => {
        const embed = generateEmbed(
            'Learn JavaScript',
            `Unfortunately alt:V is not immediately accessible for new programmers.
            We think it's great that you are trying to use alt:V but it would be more beneficial if you took some 
            time to walk through a few basic JavaScript courses which will help you with understanding code syntax.

            Here are some general things you should learn before starting:
            * Learn CommonJS
            * Learn JavaScript in-depth
            * Learn NodeJS
            * Learn alt:V
            `
        );
        embed.addField('JavaScript in 5 Minutes', 'https://www.youtube.com/watch?v=c-I5S_zTwAc');
        embed.addField('JavaScript in 1 Hour', 'https://www.youtube.com/watch?v=vReDflV-_yU');
        embed.addField('NodeJS in 1 Hour', 'https://www.youtube.com/watch?v=TlB_eWDSMt4');

        msg.reply(embed);
    },
};

export default command;
