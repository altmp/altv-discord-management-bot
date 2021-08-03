import { ICommand } from '../interfaces/ICommand';
import * as path from 'path';
import * as fs from 'fs';

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