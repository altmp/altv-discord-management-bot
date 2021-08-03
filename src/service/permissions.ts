import * as Discord from 'discord.js';
import { getGuild } from '../index';
import { ICommandBinding } from '../interfaces/ICommandBinding';
import CommandService from "./commands";
import { DatabaseService } from './database';

let commandBindings: Array<ICommandBinding> = [];

export default class PermissionService {
    /**
     * Initialize the Command Bindings
     * @static
     * @memberof PermissionService
     */
    static async init() {
        const data = await DatabaseService.getData();
        if (data.commandBindings) {
            commandBindings = data.commandBindings;
        } else {
            commandBindings = [];
        }

        console.log(`Initialized - Permission Service`);
    }

    /**
     * Check if the member has a role for this command's execution.
     * @static
     * @param {Discord.GuildMember} member
     * @param {string} commandName
     * @return {*}  {boolean}
     * @memberof PermissionService
     */
    static checkPermission(user: Discord.User, commandName: string): boolean {
        const guild = getGuild();
        const guildMember = guild.members.cache.get(user.id);
        if (!guildMember) {
            return false;
        }

        if (guildMember.hasPermission('ADMINISTRATOR', { checkAdmin: true, checkOwner: true })) {
            return true;
        }

        const index = commandBindings.findIndex(binding => binding.command === commandName);
        if (index <= -1) {
            return false;
        }

        if (commandBindings[index].allAccess) {
            return true;
        }

        const validRoles = commandBindings[index].roles;
        return validRoles.some(role => guildMember.roles.cache.get(role));
    }

    /**
     * Adds a role to the command binding and updates it.
     * All toggles allAccess if necessary.
     * @static
     * @param {string} commandName
     * @param {string} role
     * @param {boolean} [toggleAllAccess=false]
     * @return {*}  {Promise<boolean>}
     * @memberof PermissionService
     */
    static async add(commandName: string, role: string | null, toggleAllAccess: boolean = false): Promise<boolean> {
        commandName = commandName.toLowerCase();
        const commandExists = CommandService.getCommand(commandName);

        if (!commandExists) {
            return false;
        }

        let index = commandBindings.findIndex(binding => binding.command === commandName);
        if (index <= -1) {
            commandBindings.push({ command: commandName, roles: [], allAccess: false });
            index = commandBindings.length - 1;
        }

        if (role) {
            const guild = getGuild();
            const roleIndex = commandBindings[index].roles.findIndex(roleRef => roleRef === role);
            const roleExists = roleIndex >= 0;
            const roleIsValid = guild.roles.cache.get(role);

            if (roleIsValid && !roleExists) {
                commandBindings[index].roles.push(role);
            }
            
            if (!roleIsValid) {
                return false;
            }
        }
        
        if (toggleAllAccess) {
            commandBindings[index].allAccess = !commandBindings[index].allAccess;
        }

        return await DatabaseService.updateData({ commandBindings });
    }

    /**
     * Removes a role from a command binding.
     * @static
     * @param {string} commandName
     * @param {string} role
     * @return {*}  {Promise<boolean>}
     * @memberof PermissionService
     */
    static async remove(commandName: string, role: string): Promise<boolean> {
        commandName = commandName.toLowerCase();
        const commandExists = CommandService.getCommand(commandName);

        if (!commandExists) {
            return false;
        }

        const index = commandBindings.findIndex(binding => binding.command === commandName);
        if (index <= -1) {
            return false;
        }

        const roleIndex = commandBindings[index].roles.findIndex(refRole => refRole === role);
        commandBindings[index].roles.splice(roleIndex, 1);
        return await DatabaseService.updateData({ commandBindings });
    }

    /**
     * Clear all permissions for a command.
     * Default to Admin Only.
     * @static
     * @param {string} commandName
     * @return {Promise<boolean>}
     * @memberof PermissionService
     */
     static async clear(commandName: string): Promise<boolean> {
        commandName = commandName.toLowerCase();
        const commandExists = CommandService.getCommand(commandName);

        if (!commandExists) {
            return false;
        }

        const index = commandBindings.findIndex(binding => binding.command === commandName);
        if (index <= -1) {
            return false;
        }

        commandBindings[index].roles = [];
        commandBindings[index].allAccess = false;
        return await DatabaseService.updateData({ commandBindings });
    }

    /**
     * Get current cache info for command permission bindings.
     * @static
     * @param {string} commandName
     * @return {ICommandBinding}
     * @memberof PermissionService
     */
    static get(commandName: string): ICommandBinding | null {
        commandName = commandName.toLowerCase();
        const index = commandBindings.findIndex(binding => binding.command === commandName);
        if (index <= -1) {
            return null;
        }

        return commandBindings[index];
    }
}