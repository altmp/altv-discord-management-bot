import * as Discord from 'discord.js';
import ms from 'ms';
import { getGuild } from '..';
import { LOG_TYPES } from '../enums/logTypes';

import { ICommand } from '../interfaces/ICommand';
import { IMutedUser } from '../interfaces/IMutedUser';
import { DatabaseService } from '../service/database';
import { LoggerService } from '../service/logger';
import MuteService from '../service/mutes';
import generateEmbed from '../utility/embed';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'mute',
    description: '<user | id> [minutes] [reason] - Kick a player from the server.',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message, user: string, time: string, ...reason: string[]) => {
        if (time == "Forever") time = null;
        const userID = RegexUtility.parseUserID(user);
        const guildMember = msg.guild.members.cache.get(userID);
        const mutedUser: IMutedUser[] = MuteService.getAll();

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
            
            const search: IMutedUser = MuteService.get(guildMember.id);

            if (search) {
                MuteService.remove(guildMember.id);
            }
            msg.channel.send(`Unmuted <@${userID}>`);
            LoggerService.logMessage({
                type: LOG_TYPES.COMMANDS,
                msg: `<@!${guildMember.id}> got unmuted by <@!${msg.author.id}>!\nUnmuted User ID: ${guildMember.id}, Unmuted By ID: ${msg.author.id}`
            });
        } else {
            guildMember.roles.add(mutedRole);

            MuteService.add(guildMember.id, msg.author.id, time ? Date.now() + ms(time) : null, reason.length ? reason.join(' ') : null);

            const embed = generateEmbed(
                "Mute", 
                `<@!${guildMember.id}> has been muted!`
            );
            embed.addField("Until", time ? new Date(Date.now() + ms(time)) : 'Forever');
            embed.addField("Reason", reason.length ? reason.join(' ') : 'Not given');
            embed.setFooter(`Muted User ID: ${guildMember.id}, Muted By ID: ${msg.author.id}`);

            msg.channel.send(`** **`, embed);
            LoggerService.logMessage({
                type: LOG_TYPES.COMMANDS,
                msg: `<@!${guildMember.id}> got muted by <@!${msg.author.id}>!\nMuted User ID: ${guildMember.id}, Muted By ID: ${msg.author.id}`
            });
        }

        msg.delete();
    }
}

export async function checkMutedUser() {
    let mutedUser: IMutedUser[] = MuteService.getAll();

    mutedUser.forEach((mutedUserData) => {
        if (mutedUserData.until != null && Date.now() > mutedUserData.until) {
            const user = getGuild().members.cache.get(mutedUserData.userId);
            const mutedRole = getGuild().roles.cache.get("872509058198949909");
            if (user != null && user != undefined) {
                user.roles.remove(mutedRole);
            }

            MuteService.remove(mutedUserData.userId);
            LoggerService.logMessage({
                type: LOG_TYPES.MODERATOR,
                msg: `<@!${user.user.id}> got automatically umuted!\nUnmuted User ID: ${user.user.id}`,
            });
        }
    });
}

export default command;