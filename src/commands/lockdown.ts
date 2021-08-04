import * as Discord from 'discord.js';
import ms from 'ms';
import { getGuild } from '..';

import { ICommand } from '../interfaces/ICommand';
import { ILockdown } from '../interfaces/ILockdown';
import { DatabaseService } from '../service/database';
import RegexUtility from '../utility/regex';


const command: ICommand = {
    command: 'lockdown',
    description: '<channel> <minutes> - Locks a Channel.',
    execute: async (msg: Discord.Message, id: string, time: string) => {
        const channelId = RegexUtility.parseChannelID(id);
        const channel = msg.guild.channels.cache.get(channelId) as Discord.TextChannel;
        if (channel == undefined || channel == null) {
            msg.channel.send("Please provide a valid Channel ID");
            return;
        }

        const lockdownChannel: ILockdown[] = (await DatabaseService.getData()).lockdownChannel;

        if (channel.permissionsFor(msg.guild.roles.everyone).has('SEND_MESSAGES')) {
            const lockedChannelMessage = time ? `🔒 **LOCKED FOR ${ms(ms(time), { long: true})}** 🔒` : "🔒 **LOCKED** 🔒";
            const lockedChannelMessage2 = time ? `🔒 **<#${channel.id}> LOCKED FOR ${ms(ms(time), { long: true})}** 🔒` : `🔒 **<#${channel.id}> LOCKED** 🔒`;

            await channel.send(lockedChannelMessage);
            if (channel != msg.channel) msg.channel.send(lockedChannelMessage2);
            setTimeout(() => {
                channel.updateOverwrite(msg.guild.roles.everyone,{'SEND_MESSAGES': false});
            }, 50);
            lockdownChannel.push({ channelId: channel.id, until: time ? Date.now() + ms(time) : null });
        } else {
            await channel.updateOverwrite(msg.guild.roles.everyone,{'SEND_MESSAGES': null});
            setTimeout(() => {
                channel.send("🔓 **UNLOCKED** 🔓");
                if (channel != msg.channel) msg.channel.send(`🔓 **<#${channel.id}> UNLOCKED** 🔓`);
            }, 50);
            const search: ILockdown = lockdownChannel.find(x => x.channelId == channel.id);
            const index: number = lockdownChannel.indexOf(search);
            lockdownChannel.splice(index, 1);
        }

        await DatabaseService.updateData({ lockdownChannel });
    }
}

export async function checkLockdownChannel() {
    let lockdownChannel: ILockdown[] = (await DatabaseService.getData()).lockdownChannel;

    lockdownChannel.forEach(async (lockDownData) => {
        if (lockDownData.until != null && Date.now() > lockDownData.until) {
            const guild = getGuild();
            const role = guild.roles.everyone;
            const channel = guild.channels.cache.get(lockDownData.channelId) as Discord.TextChannel;
            if (!channel.permissionsFor(role).has('SEND_MESSAGES')) {
                await channel.updateOverwrite(role,{'SEND_MESSAGES': null});
                setTimeout(() => {
                    channel.send("🔓 **UNLOCKED** 🔓");
                }, 50);
            }
            const index = lockdownChannel.indexOf(lockDownData);
            lockdownChannel.splice(index, 1);
        }
    });

    await DatabaseService.updateData({ lockdownChannel });
}

export default command;