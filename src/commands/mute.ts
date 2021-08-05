import * as Discord from 'discord.js';
import ms from 'ms';
import { LOG_TYPES } from '../enums/logTypes';
import { ICommand } from '../interfaces/ICommand';
import { LoggerService } from '../service/logger';
import MuteService from '../service/mutes';
import generateEmbed from '../utility/embed';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'mute',
    description: '<user | id> [minutes] [reason] - Kick a player from the server.',
    execute: async (msg: Discord.Message, user: string, time: string, ...reason: string[]) => {
        if (time == "Forever") {
            time = null;
        }

        const userID = RegexUtility.parseUserID(user);
        const guildMember = msg.guild.members.cache.get(userID);

        if (!guildMember) {
            msg.reply(`${userID} does not exist in this guild.`);
            return;
        }

        // Mute for 5 Years if 'null'.
        const actualTime = time ? Date.now() + ms(time) : Date.now() + 1000 * 60 * 60 * 24 * 365 * 5;
        const result = await MuteService.add(guildMember.id, msg.member.id, parseInt(actualTime), reason.length ? reason.join(' ') : null);
        if (!result) {
            msg.reply(`Could not mute <@!${guildMember.id}>. Was the mute role set?`);
            return;
        }

        const embed = generateEmbed(
            "Mute", 
            `<@!${guildMember.id}> has been muted!`
        );
        embed.addField("Until", new Date(actualTime));
        embed.addField("Reason", reason.length ? reason.join(' ') : 'Not given');
        embed.setFooter(`Muted By ${msg.author.username}#${msg.author.discriminator}`);
        msg.channel.send(embed);
        LoggerService.logMessage({
            type: LOG_TYPES.COMMANDS,
            msg: `<@!${guildMember.id}> got muted by <@!${msg.author.id}>!\nMuted User ID: ${guildMember.id}, Muted By ID: ${msg.author.id}`
        });
    }
}

export default command;