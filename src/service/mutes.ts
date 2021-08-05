import * as Discord from 'discord.js';
import { getGuild } from '../index';
import { ICommandBinding } from '../interfaces/ICommandBinding';
import { IMutedUser } from '../interfaces/IMutedUser';
import CommandService from "./commands";
import { DatabaseService } from './database';

let mutedUser: Array<IMutedUser> = [];

export default class MuteService {
    /**
     * Initialize the Mute Service
     * @static
     * @memberof MuteService
     */
    static async init() {
        const data = await DatabaseService.getData();
        if (data.mutedUser) {
            mutedUser = data.mutedUser;
        } else {
            mutedUser = [];
        }

        console.log(`Initialized - Mute Service`);
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
        let index = mutedUser.findIndex(user => user.userId === userId);
        if (index <= -1) {
            mutedUser.push({ userId: userId, mutedById: mutedById, until: until, reason: reason });
        }

        return await DatabaseService.updateData({ mutedUser });
    }

    /**
     * Removes a user from the muted users.
     * @static
     * @param {string} userId
     * @return {*}  {Promise<boolean>}
     * @memberof MuteService
     */
    static async remove(userId: string): Promise<boolean> {
        const index = mutedUser.findIndex(user => user.userId === userId);
        if (index <= -1) {
            return false;
        }

        const userIndex = mutedUser.findIndex(user => user.userId === userId);
        mutedUser.splice(userIndex, 1);
        return await DatabaseService.updateData({ mutedUser });
    }

    /**
     * Get current cache info for muted user.
     * @static
     * @param {string} userId
     * @return {IMutedUser}
     * @memberof MuteService
     */
    static get(userId: string): IMutedUser | null {
        const index = mutedUser.findIndex(user => user.userId === userId);
        if (index <= -1) {
            return null;
        }

        return mutedUser[index];
    }

    /**
     * Get current cache for all muted user.
     * @static
     * @return {IMutedUser[]}
     * @memberof MuteService
     */
     static getAll(): IMutedUser[] | null {
        return mutedUser;
    }
}