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
        const native = natives.find(native => native.name == hash || native.hash == hash)

        if(native) {
            const embed = generateEmbed(`Native - ${native.name}`, native.comment)
        }

        msg.reply("Could not find requested native!")
    }
}

export default command;