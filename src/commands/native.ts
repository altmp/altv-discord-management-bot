import * as Discord from 'discord.js';
import fs from 'fs'
import path from 'path';

import { ICommand } from '../interfaces/ICommand';
import { INative } from '../interfaces/INative';
import RegexUtility from '../utility/regex';

const natives: INative[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/natives.json')).toString());

const command: ICommand = {
    command: 'native',
    description: 'Native a player from the server.',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message, hash: string) => {
        const native: INative | undefined = natives.find(native => native.name.toLowerCase() == hash.toLowerCase() || native.hash.toLowerCase() == hash.toLowerCase())

        if (native === undefined) {
            await msg.reply("Could not find requested native!")
            return;
        }

        const paramsFormatted = native.params ? native.params.map(param => `${param.name}: ${param.type}`).join(', '): '';
        const resultFormatted = Array.isArray(native.result) ? `[` + native.result.join(', ') + `]` : native.result;
        const commentLines = native.comment.split('\n');

        let commentFormatted = native.comment;
        if (commentLines.length > 10) {
            commentFormatted = commentLines.slice(0, 10).join('\n');
            commentFormatted += `...\n\n[Read more](https://natives.altv.mp/#/${native.hash})`
        }

        const embed = new Discord.MessageEmbed({
            title: native.name,
            description: `\`\`\`ts\nfunction ${native.name}(${paramsFormatted}): ${resultFormatted}\n\`\`\`\n${commentFormatted}`,
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