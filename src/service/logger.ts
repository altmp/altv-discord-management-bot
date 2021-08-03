import * as Discord from 'discord.js';

import { LOG_TYPES } from '../enums/logTypes';
import { getGuild } from '../index';
import { ILog } from '../interfaces/ILog';

type ChannelTypeBindings = { [key: string]: string };

let channelTypeBindings: ChannelTypeBindings = {};
let commandLogs: Array<ILog> = [];

export class LoggerService {
    /**
     * Bind a channel id to a log type.
     * All logs for the message of this type get sent to this channel.
     * @static
     * @param {string} channelID
     * @param {LOG_TYPES} type
     * @memberof LoggerService
     */
    static setLoggerChannel(channelID: string, type: LOG_TYPES) {
        channelTypeBindings[type] = channelID;
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
        if (!channelTypeBindings[data.type]) {
            // 
            return;
        }

        const channel = guild.channels.cache.get(channelTypeBindings[data.type]) as Discord.TextChannel;
        if (!channel) {
            throw new Error(`Channel: ${channelTypeBindings[data.type]} does not exist.`);
        }

        channel.send(data.msg);
    }
}