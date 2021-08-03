import * as Discord from 'discord.js';

import { registerCommand } from '../service/commands';

registerCommand({ name: 'ping', command, description: '- Get a response back from the bot.' });

async function command(msg: Discord.Message) {
    msg.reply('Pong');
}
