import * as Discord from 'discord.js';
import { LOG_TYPES } from '../enums/logTypes';

import { ICommand } from '../interfaces/ICommand';
import { LoggerService } from '../service/logger';
import MuteService from '../service/mutes';
import RegexUtility from '../utility/regex';

const command: ICommand = {
    command: 'muterole',
    description: '<role | id> - Set the mute role to use.',
    execute: async (msg: Discord.Message, role: string) => {
        const roleID = RegexUtility.parseRoleID(role);
        const didSet = MuteService.setMuteRole(roleID);

        if (!didSet) {
            msg.reply(`Could not set mute role for some reason.`);
            return;
        }

        msg.reply(`Mute role was set to: <@&${roleID}>`)
        LoggerService.logMessage({
            type: LOG_TYPES.COMMANDS,
            msg: `<@!${msg.member.id}> Set Mute Role to <@&${roleID}>`
        });
    }
}

export default command;