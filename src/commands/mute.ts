import * as Discord from 'discord.js';
import ms from 'ms';
import { getGuild } from '..';
import { LOG_TYPES } from '../enums/logTypes';

import { ICommand } from '../interfaces/ICommand';
import { IMutedUser } from '../interfaces/IMutedUser';
import { DatabaseService } from '../service/database';
import { LoggerService } from '../service/logger';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'mute',
    description: '<user | id> [minutes] [reason] - Kick a player from the server.',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message, user: string, time: string, ...reason) => {
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
            msg.channel.send(`Unmuted <@${userID}>`);
            LoggerService.logMessage({
                type: LOG_TYPES.COMMANDS,
                msg: `<@!${guildMember.id}> got unmuted by <@!${msg.author.id}>!\nUnmuted User ID: ${guildMember.id}, Unmuted By ID: ${msg.author.id}`
            });
        } else {
            guildMember.roles.add(mutedRole);

            const mutedUser: IMutedUser[] = (await DatabaseService.getData()).mutedUser;

            mutedUser.push({ userId: guildMember.id, userName: guildMember.user.username, mutedById: msg.author.id, mutedByName: msg.author.username, until: time ? Date.now() + ms(time) : null, reason: reason ? reason.join(' ') : null });
            await DatabaseService.updateData({ mutedUser });

            LoggerService.logMessage({
                type: LOG_TYPES.COMMANDS,
                msg: `<@!${guildMember.id}> got muted by <@!${msg.author.id}>!\nMuted User ID: ${guildMember.id}, Muted By ID: ${msg.author.id}`
            });
        }
    }
}

export async function checkMutedUser() {
    let mutedUser: IMutedUser[] = (await DatabaseService.getData()).mutedUser;

    mutedUser.forEach((mutedUserData) => {
        if (mutedUserData.until != null && Date.now() > mutedUserData.until) {
            const user = getGuild().members.cache.find(x => x.id == mutedUserData.userId);
            const mutedRole = getGuild().roles.cache.get("872509058198949909");
            if (user != null && user != undefined) {
                user.roles.remove(mutedRole);
            }

            const index: number = mutedUser.indexOf(mutedUserData);
            mutedUser.splice(index, 1);
            LoggerService.logMessage({
                type: LOG_TYPES.MODERATOR,
                msg: `<@!${user.user.id}> got automatically umuted!\nUnmuted User ID: ${user.user.id}`,
            });
        }
    });

    await DatabaseService.updateData({ mutedUser });
}

export default command;