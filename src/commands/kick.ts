import * as Discord from 'discord.js';

import { ICommand } from '../interfaces/ICommand';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'kick',
    description: '<user> - Kick a player from the server.',
    execute: async (msg: Discord.Message, user: string, reason: string) => {
        const guildMember = msg.guild.members.cache.get(RegexUtility.parseUserID(user));

        // TODO: log the kick

        guildMember.kick(reason)
    }
}

export default command;