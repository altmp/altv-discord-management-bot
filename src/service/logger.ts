import * as Discord from 'discord.js';

import { LOG_TYPES } from '../enums/logTypes';
import { getGuild } from '../index';
import { ILog } from '../interfaces/ILog';
import { ILogBinding } from '../interfaces/ILogBinding';
import generateEmbed from '../utility/embed';
import { DatabaseService } from './database';

let logBindings: Array<ILogBinding> = []
let commandLogs: Array<ILog> = [];

export class LoggerService {
    static async init() {
        const data = await DatabaseService.getData();
        if (data.logBindings) {
            logBindings = data.logBindings;
        } else {
            logBindings = [];
        }
    }

    /**
     * Bind a channel id to a log type.
     * All logs for the message of this type get sent to this channel.
     * @static
     * @param {string} channelID
     * @param {LOG_TYPES} type
     * @memberof LoggerService
     */
    static setLoggerChannel(channelID: string, type: LOG_TYPES) {
        const data: ILogBinding = { type, channel: channelID };
        const index = logBindings.findIndex(x => x.type === type);
        if (index >= 0) {
            logBindings[index] = data;
        } else {
            logBindings.push(data);
        }

        DatabaseService.updateData({ logBindings });
    }

    /**
     * Send a message to a log type.
     * @static
     * @param {string} msg
     * @param {LOG_TYPES} type
     * @memberof LoggerService
     */
    static logMessage(data: ILog) {
        data.timestamp = Date.now();
        commandLogs.push(data);

        const guild = getGuild();

        const logBinding = logBindings.find(binding => binding.type === data.type);

        if (!logBinding) {
            console.info(`No Log Binding for Log Type ${data.type}`);
            return;
        }

        const channel = guild.channels.cache.get(logBinding.channel) as Discord.TextChannel;
        if (!channel) {
            console.warn(`Channel: ${logBinding.channel} does not exist.`)
            return;
        }

        const embed = generateEmbed(`[${new Date(data.timestamp).toUTCString()}] ${data.type}`, data.msg)
        channel.send(embed);
    }
}