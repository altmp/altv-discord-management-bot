import * as Discord from 'discord.js';
import generateEmbed from '../utility/embed';

import { ICommand } from '../interfaces/ICommand';

const command: ICommand = {
    command: 'debug',
    description: 'Embed which explains how to enable debug mode.',
    execute: async (msg: Discord.Message) => {
        const embed = generateEmbed('We Support Reconnect in Debug Mode Only');
        embed.addField(
            'Why?',
            'There is no proper way to clear certain data from the GTA:V runtime. Other third-party GTA:V clients are not properly clearing the memory for GTA:V which results in an unstable client. In order to give the best experience that we can on alt:V we require a fresh game state for each server. This will lengthen the amount of time you are able to play on a custom server without crashing.'
        );
        embed.addField(
            'How?',
            "If you are a server developer you may set `debug: 'true'` in your test server `server.cfg` file. You will also need to modify your `altv.cfg` which is where alt:V is installed. Simply add `debug: 'true'` to your `altv.cfg` and `server.cfg` to enable debug mode."
        );

        msg.reply(embed);
    },
};

export default command;
