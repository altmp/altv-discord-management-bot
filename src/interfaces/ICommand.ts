import { Message } from 'discord.js'; 

export interface ICommand {
    command: string;
    alias?: string[];
    description: string;
    execute: (message: Message, ...args: any[]) => void;
}
