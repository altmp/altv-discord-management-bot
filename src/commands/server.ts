import * as Discord from 'discord.js';

import { ICommand } from '../interfaces/ICommand';
import { MasterList } from 'altv-api-wrapper';
import generateEmbed from '../utility/embed';

const command: ICommand = {
    command: 'server',
    description: 'Fetch a server from the masterlist.',
    execute: async (msg: Discord.Message, ...identifier: string[]) => {
        const serverList = await MasterList.getServerList();
        const server = serverList.find(
            (server) =>
                server.id == identifier[0] ||
                server.host.includes(identifier[0]) ||
                server.cdnUrl.includes(identifier[0]) ||
                server.name.toLowerCase().includes(identifier.join(' ').toLowerCase())
        );

        console.log(server);

        if (!server) {
            msg.reply('Could not find requested server!');
        } else {
            let description = `**${server.players} / ${server.maxPlayers}**`;
            description += server.promoted || server.locked ? '  -  ' : '';
            description += server.promoted ? '⭐' : '';
            description += server.locked ? '🔒' : '';
            description += `\n ${server.description}`;

            const embed = generateEmbed(server.name, description);
            if (!server.website.match(/^[a-zA-Z]+:\/\//)) server.website = 'https://' + server.website;
            embed.setURL(server.website);
            embed.setFooter(server.id);

            embed.title = server.name + '\n';

            msg.reply(embed);
        }
    },
};

export default command;
