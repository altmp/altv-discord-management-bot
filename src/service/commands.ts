import { ICommand } from '../interfaces/ICommand';
import * as path from 'path';
import * as fs from 'fs';
import * as Discord from 'discord.js';
import getPrefix from '../utility/prefix';

const commands: Array<ICommand> = [];

export default class CommandService {
    /**
     * Loads all commands from the 'commands' folder.
     * @static
     * @memberof CommandService
     */
    static async loadCommands(): Promise<void> {
        const commandsDirectory = path.join(__dirname, '../commands/');

        for (const file of fs.readdirSync(commandsDirectory)) {
            const commandModule = await import(path.join(commandsDirectory, file));
            commands.push(commandModule.default);
            console.log(`Added Command: ${file}`);
        }
    }

    /**
     * Standardized wrong usage reply for commands.
     * @static
     * @param {Discord.Message} msg
     * @param {string} commandName
     * @memberof CommandService
     */
    static sendWrongUsage(msg: Discord.Message, commandName: string): Promise<Discord.Message> {
        const cmd = CommandService.getCommand(commandName);
        return msg.reply(`Wrong Usage - ${getPrefix()}${cmd.command}${cmd.description}`);
    }

    /**
     * Get a command by command name.
     * @static
     * @param {string} commandName
     * @return {ICommand}
     * @memberof CommandService
     */
    static getCommand(commandName: string): ICommand {
        return commands.find((cmd) => cmd.command === commandName);
    }

    /**
     * Get all commands available.
     * @static
     * @return {Array<ICommand>}
     * @memberof CommandService
     */
    static getCommands(): Array<ICommand> {
        return commands;
    }
}