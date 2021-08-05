import * as Discord from 'discord.js';
import { ICommand } from '../interfaces/ICommand';
import MuteService from '../service/mutes';
import generateEmbed from '../utility/embed';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'muteinfo',
    description: '<user | id> - Displays info about a muted user.',
    execute: async (msg: Discord.Message, user: string) => {
        const userID = RegexUtility.parseUserID(user);
        const guildMember = msg.guild.members.cache.get(userID);

        if (!guildMember) {
            msg.reply(`${userID} is not in this guild.`);
            return;
        }

        const mutedUser = MuteService.get(guildMember.id)

        if (mutedUser) {
            const embed = generateEmbed(
                "Mute Info",
                `<@!${mutedUser.userId}>`
            );
            embed.addField("Muted By", `<@!${mutedUser.mutedById}>`);
            embed.addField("Until", `${mutedUser.until ? new Date(mutedUser.until) : "Forever"}`);
            embed.addField("Reason", `${mutedUser.reason ? mutedUser.reason : "Not Given"}`);
            msg.channel.send(embed);
        } else {
            msg.channel.send("The specified User is not muted!");
        }
    }
}

export default command;