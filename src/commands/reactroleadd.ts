import * as Discord from 'discord.js';

import { ICommand } from '../interfaces/ICommand';

const command: ICommand = {
    command: 'reactroleadd',
    description: '<display_name> <emoji> <rol_id> [description] - Ban a player from the server.',
    execute: async (msg: Discord.Message, display_name: string, emoji: string, role_id: string, description: string) => {
    }
}

export default command;