import * as Discord from 'discord.js';
import generateEmbed from '../utility/embed';

import { ICommand } from '../interfaces/ICommand';

const command: ICommand = {
    command: 'docs',
    description: 'Embed links to alt:V documentation.',
    execute: async (msg: Discord.Message) => {
        const embed = generateEmbed('Here is the Official Documentation');
        embed.addField(
            'JavaScript',
            `
            https://docs.altv.mp/js/api/alt-client.html
            https://docs.altv.mp/js/api/alt-server.html
            `
        );
        embed.addField('C#', 'https://docs.altv.mp/cs/articles/index.html');

        msg.reply(embed);
    },
};

export default command;
