import { MessageMenuOption } from 'discord-buttons';
import * as Discord from 'discord.js';
import fs from 'fs'
import path from 'path';

import { ICommand } from '../interfaces/ICommand';
import { IReactRole } from '../interfaces/IReactRole';
import { MenuUtility } from '../utility/menu';
import { MenuOptionsUtility } from '../utility/menu_options';

const reactRole: IReactRole[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/react_role.json')).toString());

const command: ICommand = {
    command: 'reactrole',
    description: 'Shows react role dropdown Menu.',
    execute: async (msg: Discord.Message) => {
        let options: Array<MessageMenuOption> = [];

        reactRole.forEach(roles => options.push(
            MenuOptionsUtility.generate()
                .setLabel(roles.name)
                .setValue(roles.name)
                .setEmoji(roles.emoji)
                .setDescription(roles.description)
                ));

        const menu = MenuUtility.generate()
            .setID('RoleSelect')
            .setPlaceholder('Select your Role!')
            .setMaxValues(options.length)
            .setMinValues(1);

        options.forEach(option => menu.addOption(option));

        MenuUtility.reply(msg, "** **", menu);
        msg.delete();
    }
}

export default command;