import * as Discord from 'discord.js';
import ms from 'ms';

import { ICommand } from '../interfaces/ICommand';
import LockdownService from '../service/lockdowns';
import RegexUtility from '../utility/regex';


const command: ICommand = {
    command: 'lockdown',
    description: '<channel> <minutes> - Locks a Channel.',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message, id: string, time: string) => {
        const channelId = RegexUtility.parseChannelID(id);
        const channel = msg.guild.channels.cache.get(channelId) as Discord.TextChannel;
        if (channel == undefined || channel == null) {
            msg.channel.send("Please provide a valid Channel ID");
            return;
        }

        if (channel.permissionsFor(msg.guild.roles.everyone).has('SEND_MESSAGES')) {
            const lockedChannelMessage = time ? `🔒 **LOCKED FOR ${ms(ms(time), { long: true})}** 🔒` : "🔒 **LOCKED** 🔒";
            const lockedChannelMessage2 = time ? `🔒 **<#${channel.id}> LOCKED FOR ${ms(ms(time), { long: true})}** 🔒` : `🔒 **<#${channel.id}> LOCKED** 🔒`;

            await channel.send(lockedChannelMessage);
            if (channel != msg.channel) msg.channel.send(lockedChannelMessage2);
            await LockdownService.add(channel.id, time ? Date.now() + ms(time) : null)
        } else {
            await LockdownService.remove(channel.id, false);
            setTimeout(async () => {
                await channel.send("🔓 **UNLOCKED** 🔓");
                if (channel != msg.channel) msg.channel.send(`🔓 **<#${channel.id}> UNLOCKED** 🔓`);
            }, 50);
        }
    }
}

export default command;