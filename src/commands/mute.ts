import * as Discord from 'discord.js';
import { LOG_TYPES } from '../enums/logTypes';

import { ICommand } from '../interfaces/ICommand';
import { IMutedUser } from '../interfaces/IMutedUser';
import { DatabaseService } from '../service/database';
import { LoggerService } from '../service/logger';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'mute',
    description: '<user> [minutes] [reason] - Kick a player from the server.',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message, user: string, minutes: number, reason: string) => {
        const userID = RegexUtility.parseUserID(user);
        const guildMember = msg.guild.members.cache.get(userID);

        if (!guildMember) {
            msg.reply(`${userID} does not exist.`);
            return;
        }

        const mutedRole = msg.guild.roles.cache.get("872509058198949909");

        if (!mutedRole) {
            msg.reply(`Role does not exist.`);
            return;
        }

        if (guildMember.roles.cache.has("872509058198949909")) {
            guildMember.roles.remove(mutedRole);
            
            const mutedUser: IMutedUser[] = (await DatabaseService.getData()).mutedUser;
            const search: IMutedUser = mutedUser.find(x => x.userId == guildMember.id);

            if (search) {
                const index: number = mutedUser.indexOf(search);
                mutedUser.splice(index, 1);
                await DatabaseService.updateData({ mutedUser });
            }
        } else {
            guildMember.roles.add(mutedRole);

            const mutedUser: IMutedUser[] = (await DatabaseService.getData()).mutedUser;

            mutedUser.push({ userId: guildMember.id, userName: guildMember.user.username, mutedById: msg.author.id, mutedByName: msg.author.username });
            await DatabaseService.updateData({ mutedUser });
        }
    }
}

export default command;