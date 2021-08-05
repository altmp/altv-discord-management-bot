import { TextChannel } from 'discord.js';
import { LOG_TYPES } from '../enums/logTypes';
import { getGuild } from '../index';
import { ILockdown } from '../interfaces/ILockdown';
import { DatabaseService } from './database';
import { LoggerService } from './logger';

let lockdownChannel: Array<ILockdown> = [];

export default class LockdownService {
    /**
     * Initialize the Lockdown Service
     * @static
     * @memberof LockdownService
     */
    static async init() {
        const data = await DatabaseService.getData();

        lockdownChannel = data.lockdownChannel.length ? data.lockdownChannel : [];

        console.log(`Initialized - Lockdown Service`);
    }

    /**
     * Adds a channel to the locked channel and updates it.
     * @static
     * @param {string} channelId
     * @param {number} until
     * @return {*}  {Promise<boolean>}
     * @memberof LockdownService
     */
    static async add(channelId: string,  until: number | null): Promise<boolean> {
        const guild = getGuild();
        const guildChannel = guild.channels.cache.get(channelId);

        if (!guildChannel) {
            return false;
        }

        if (guildChannel.permissionsFor(guild.roles.everyone).has('SEND_MESSAGES')) {
            guildChannel.updateOverwrite(guild.roles.everyone,{'SEND_MESSAGES': false});
        }

        let index = lockdownChannel.findIndex(channel => channel.channelId === channelId);
        if (index <= -1) {
            lockdownChannel.push({ channelId: channelId, until: until });
        } else {
            lockdownChannel[index] = { channelId: channelId, until: until };
        }

        return await DatabaseService.updateData({ lockdownChannel });
    }

    /**
     * Removes a channel from the locked channels.
     * @static
     * @param {string} channelId
     * @return {*}  {Promise<boolean>}
     * @memberof LockdownService
     */
    static async remove(channelId: string, isAutomatic: boolean = true): Promise<boolean> {
        const guild = getGuild();
        const guildChannel = guild.channels.cache.get(channelId) as TextChannel;

        if (!guildChannel) {
            return false;
        }

        if (!guildChannel.permissionsFor(guild.roles.everyone).has('SEND_MESSAGES')) {
            await guildChannel.updateOverwrite(guild.roles.everyone,{'SEND_MESSAGES': null});
        }

        const index = lockdownChannel.findIndex(channel => channel.channelId === channelId);
        if (index <= -1) {
            return false;
        } else {
            lockdownChannel.splice(index, 1);

            if (isAutomatic) {
                guildChannel.send("🔓 **UNLOCKED** 🔓");
                LoggerService.logMessage({
                    type: LOG_TYPES.MODERATOR,
                    msg: `<#${channelId}> was unlocked, time has expired for lock.`,
                });
            }
        }

        return await DatabaseService.updateData({ lockdownChannel });
    }

    /**
     * Get current cache info for locked channels.
     * @static
     * @param {string} channelId
     * @return {ILockdown}
     * @memberof LockdownService
     */
    static get(channelId: string): ILockdown | null {
        const index = lockdownChannel.findIndex(channel => channel.channelId === channelId);
        if (index <= -1) {
            return null;
        }

        return lockdownChannel[index];
    }

    /**
     * Tick event to check Lockdown(s).
     * @static
     * @memberof LockdownService
     */
    static async tick() {
        if (lockdownChannel.length <= 0) {
            return;
        }

        for (let i = lockdownChannel.length - 1; i >= 0; i--) {
            const channel = lockdownChannel[i];
            if (!channel.until) {
                continue;
            }

            if (Date.now() < channel.until) {
                continue;
            }

            await LockdownService.remove(channel.channelId, true);
        }
    }

    /**
     * Get current cache for all locked channel.
     * @static
     * @return {ILockdown[]}
     * @memberof LockdownService
     */
     static getAll(): ILockdown[] | null {
        return lockdownChannel;
    }
}