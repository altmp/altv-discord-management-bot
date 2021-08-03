import * as Discord from 'discord.js';
import fs from 'fs'
import path from 'path';

import { ICommand } from '../interfaces/ICommand';
import { INative } from '../interfaces/INative';
import generateEmbed from '../utility/embed';

const natives: INative[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/natives.json')).toString());

const command: ICommand = {
    command: 'native',
    description: 'Native a player from the server.',
    execute: async (msg: Discord.Message, hash: string) => {
        const native: INative | undefined = natives.find(native => native.name.toLowerCase() == hash.toLowerCase() || native.hash.toLowerCase() == hash.toLowerCase())

        if (native === undefined) {
            await msg.reply("Could not find requested native!")
            return;
        }

        const paramsFormatted = native.params ? native.params.map(param => `${param.name}: ${param.type}`).join(', '): '';
        const resultFormatted = Array.isArray(native.result) ? `[` + native.result.join(', ') + `]` : native.result;

        const embed = new Discord.MessageEmbed({
            title: native.name,
            description: `\`\`\`ts\nfunction ${native.name}(${paramsFormatted}): ${resultFormatted}\n\`\`\`\n${native.comment}`,
            color: '#008736',
            footer: {
                text: `${native.hash} | Build: ${native.build}`,
            },
            url: `https://natives.altv.mp/#/${native.hash}`
        });

        await msg.reply(embed)
    },
}

export default command;