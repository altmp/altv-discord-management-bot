import * as Discord from 'discord.js';
import { ICommand } from '../interfaces/ICommand';
import generateEmbed from "../utility/embed";

const command: ICommand = {
    command: 'note',
    description: '!note [name] - Returns a predefined note from an array about specific functionality. Similar to how !support works.',
    execute: async (msg: Discord.Message) => {
        
        if(msg.content.split(' ').length <= 1 || msg.content.split(' ').length > 2) {
            await msg.reply("Wrong usage! -> !note <name> | !note <add/del> <name>");
        }
        
        switch (msg.content.split(' ')[1]) {
            case 'test':
                const testEmbed = generateEmbed(`Test`, 'Test');
                await msg.reply(testEmbed);
                break;
            case 'role':
                const roleEmbed = generateEmbed(`Role`, 'Role');
                await msg.reply(roleEmbed);
                break;
        }
    }
}

export default command;