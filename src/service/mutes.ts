import { LOG_TYPES } from '../enums/logTypes';
import { getGuild } from '../index';
import { IMutedUser } from '../interfaces/IMutedUser';
import { DatabaseService } from './database';
import { LoggerService } from './logger';

let mutedUsers: Array<IMutedUser> = [];
let mutedRole: string;

export default class MuteService {
    /**
     * Initialize the Mute Service
     * @static
     * @memberof MuteService
     */
    static async init() {
        const data = await DatabaseService.getData();

        mutedUsers = data.mutedUsers ? data.mutedUsers : [];
        mutedRole = data.mutedRole ? data.mutedRole : null;

        console.log(`Initialized - Mute Service`);
    }

    /**
     * Verify that the role is appended to a user on join if they should be muted.
     * @static
     * @param {string} userID
     * @memberof MuteService
     */
    static checkNewUser(userID: string): void {
        const guild = getGuild();
        const index = mutedUsers.findIndex(x => x.userId == userID);
    
        if (index <= -1) {
            return;
        }

        const guildMember = guild.members.cache.get(userID);
        if (!guildMember) {
            return;
        }

        if (guildMember.roles.cache.has(mutedRole)) {
            return;
        }

        guildMember.roles.add(mutedRole);
    }

    /**
     * Adds a user to the muted user and updates it.
     * @static
     * @param {string} userId
     * @param {string} mutedById
     * @param {number} until
     * @param {string} reason
     * @return {*}  {Promise<boolean>}
     * @memberof MuteService
     */
    static async add(userId: string, mutedById: string, until: number | null, reason: string | null): Promise<boolean> {
        const guild = getGuild();
        const guildMember = guild.members.cache.get(userId);

        if (!guildMember) {
            return false;
        }

        if (!mutedRole) {
            return false;
        }

        if (!guildMember.roles.cache.has(mutedRole)) {
            await guildMember.roles.add(mutedRole);
        }

        let index = mutedUsers.findIndex(user => user.userId === userId);
        if (index <= -1) {
            mutedUsers.push({ userId: userId, mutedById: mutedById, until: until, reason: reason });
        } else {
            mutedUsers[index] = { userId: userId, mutedById: mutedById, until: until, reason: reason };
        }

        return await DatabaseService.updateData({ mutedUsers });
    }

    /**
     * Removes a user from the muted users.
     * @static
     * @param {string} userId
     * @return {*}  {Promise<boolean>}
     * @memberof MuteService
     */
    static async remove(userId: string, isAutomatic: boolean = true): Promise<boolean> {
        const guild = getGuild();
        const guildMember = guild.members.cache.get(userId);

        if (!guildMember) {
            return false;
        }

        if (!mutedRole) {
            return false;
        }

        if (guildMember.roles.cache.has(mutedRole)) {
            guildMember.roles.remove(mutedRole);
        }

        const index = mutedUsers.findIndex(user => user.userId === userId);
        if (index <= -1) {
            return false;
        } else {
            mutedUsers.splice(index, 1);

            if (isAutomatic) {
                LoggerService.logMessage({
                    type: LOG_TYPES.MODERATOR,
                    msg: `<@!${userId}> was unmuted, time has expired for mute.`,
                });
            }
        }

        return await DatabaseService.updateData({ mutedUsers });
    }

    /**
     * Sets the target Mute Role for muting user(s).
     * @static
     * @param {string} role
     * @return {*}  {Promise<boolean>}
     * @memberof MuteService
     */
    static async setMuteRole(role: string): Promise<boolean> {
        const guild = getGuild();
       
        if (!guild.roles.cache.has(role)) {
            return false;
        }

        mutedRole = role;
        return await DatabaseService.updateData({ mutedRole });
    }

    /**
     * Get current cache info for muted user.
     * @static
     * @param {string} userId
     * @return {IMutedUser}
     * @memberof MuteService
     */
    static get(userId: string): IMutedUser | null {
        const index = mutedUsers.findIndex(user => user.userId === userId);
        if (index <= -1) {
            return null;
        }

        return mutedUsers[index];
    }

    /**
     * Tick event to check Mute(s).
     * @static
     * @memberof MuteService
     */
    static async tick() {
        if (mutedUsers.length <= 0) {
            return;
        }

        for (let i = mutedUsers.length - 1; i >= 0; i--) {
            const mutedUser = mutedUsers[i];
            if (!mutedUser.until) {
                continue;
            }

            if (Date.now() < mutedUser.until) {
                continue;
            }

            await MuteService.remove(mutedUser.userId, true);
        }
    }

    /**
     * Get current cache for all muted user.
     * @static
     * @return {IMutedUser[]}
     * @memberof MuteService
     */
     static getAll(): IMutedUser[] | null {
        return mutedUsers;
    }
}