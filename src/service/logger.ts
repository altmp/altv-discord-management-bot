import * as Discord from 'discord.js';

import { LOG_TYPES } from '../enums/logTypes';
import { getGuild } from '../index';
import { ILog } from '../interfaces/ILog';
import { ILogBinding } from '../interfaces/ILogBinding';
import generateEmbed from '../utility/embed';
import { DatabaseService } from './database';

let logBindings: Array<ILogBinding> = []

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
    static async setLoggerChannel(channelID: string, type: string): Promise<boolean> {
        type = type.toUpperCase();

        if (!Object.keys(LOG_TYPES).find(x => x === type)) {
            return false;
        }

        const data: ILogBinding = { type: LOG_TYPES[type], channel: channelID };
        const index = logBindings.findIndex(x => x.type === type);
        if (index >= 0) {
            logBindings[index] = data;
        } else {
            logBindings.push(data);
        }

        return await DatabaseService.updateData({ logBindings });
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

        const guild = getGuild();
        if (!guild) {
            console.warn(`No guild was found for logging.`);
            return;
        }

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

        const embed = generateEmbed(`[${data.timestamp}] ${data.type.toUpperCase()} LOGS`, data.msg)
        channel.send(embed);
    }
}