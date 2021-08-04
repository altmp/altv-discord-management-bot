import * as Discord from 'discord.js';
import { LOG_TYPES } from '../enums/logTypes';

import { ICommand } from '../interfaces/ICommand';
import { IMutedUser } from '../interfaces/IMutedUser';
import { DatabaseService } from '../service/database';
import { LoggerService } from '../service/logger';
import generateEmbed from '../utility/embed';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'muteinfo',
    description: '<user | id> - Displays info about a muted user.',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message, user: string) => {
        const userID = RegexUtility.parseUserID(user);
        const guildMember = msg.guild.members.cache.get(userID);

        if (!guildMember) {
            msg.reply(`${userID} does not exist.`);
            return;
        }

        const mutedUser: IMutedUser[] = (await DatabaseService.getData()).mutedUser;
        const search = mutedUser.find(x => x.userId == userID);

        if (search) {
            const embed = generateEmbed(
                "Mute Info",
                `Display Infos about the mute of <@${userID}>`
            );
            embed.addField("Muted by", `<@${search.mutedById}>`);

            msg.channel.send("** **", embed);
        }
    }
}

export default command;