import * as Discord from 'discord.js';

import { ICommand } from '../interfaces/ICommand';

const command: ICommand = {
    command: 'reactroleremove',
    description: '<role_id> - .',
    execute: async (msg: Discord.Message, role_id: string) => {
    }
}

export default command;