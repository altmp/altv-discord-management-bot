import { Message } from 'discord.js'; 

export interface ICommand {
    command: string;
    alias?: string[];
    description: string;
    skipPermissionCheck?: boolean;
    execute: (message: Message, ...args: any[]) => void;
}
