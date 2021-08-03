import * as Discord from 'discord.js';

import { ICommand } from '../interfaces/ICommand';
import RegexUtility from '../utility/regex';


const command: ICommand = {
    command: 'lockdown',
    description: '<user> - Kick a player from the server.',
    execute: async (msg: Discord.Message, id: string, minutes: number) => {
        const channel = msg.guild.channels.cache.find(ch => ch.id == id || ch.id == RegexUtility.parseChannelID(id)) as Discord.TextChannel;
        if (channel == undefined || channel == null) {
            msg.channel.send("Please provide a valid Channel ID");
            return;
        }

        if (channel.permissionsFor(msg.guild.roles.everyone).has('SEND_MESSAGES')) {
            await channel.send("🔒 **LOCKED** 🔒")
            if (channel != msg.channel) msg.channel.send(`🔒 **<#${channel.id}> LOCKED** 🔒`);
            setTimeout(() => {
                channel.updateOverwrite(msg.guild.roles.everyone,{'SEND_MESSAGES': false});
            }, 50);
        } else {
            await channel.updateOverwrite(msg.guild.roles.everyone,{'SEND_MESSAGES': true});
            setTimeout(() => {
                channel.send("🔓 **UNLOCKED** 🔓");
                if (channel != msg.channel) msg.channel.send(`🔓 **<#${channel.id}> UNLOCKED** 🔓`);
            }, 50);
        }
    }
}

export default command;