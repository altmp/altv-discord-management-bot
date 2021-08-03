import * as Discord from 'discord.js';

import { ICommand } from '../interfaces/ICommand';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'ban',
    description: '<user> - Ban a player from the server.',
    execute: async (msg: Discord.Message, user: string, reason: string) => {
        const guildMember = msg.guild.members.cache.get(RegexUtility.parseUserID(user));

        // TODO: log the ban

        guildMember.ban({reason})
    }
}

export default command;