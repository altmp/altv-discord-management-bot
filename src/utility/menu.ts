import * as DiscordMenus from 'discord-buttons';
import * as Discord from 'discord.js';
import { getGuild } from '../index';

export class MenuUtility {
    /**
     * Create a new Menu
     * @static
     * @return {*} 
     * @memberof MenuUtility
     */
    static generate() {
        return new DiscordMenus.MessageMenu();
    }

    /**
     * Combine Menus into Single Row
     * @static
     * @param {Array<DiscordMenus.MessageMenu>} menus
     * @return {*}  {DiscordMenus.MessageActionRow}
     * @memberof MenuUtility
     */
    static combine(menus: Array<DiscordMenus.MessageMenu>): DiscordMenus.MessageActionRow {
        const row = new DiscordMenus.MessageActionRow();
        row.addComponents(...menus);
        return row;
    }

    /**
     * Send Menu(s) to a Channel
     * @static
     * @param {string} channelID
     * @param {string} message
     * @param {(DiscordMenus.MessageActionRow | DiscordMenus.MessageMenu)} menus
     * @return {*}  {(Promise<Discord.Message | Discord.Message[] | null>)}
     * @memberof MenuUtility
     */
    static async send(channelID: string, message: string, menus: DiscordMenus.MessageActionRow | DiscordMenus.MessageMenu): Promise<Discord.Message | Discord.Message[] | null> {
        const guild = getGuild();
        const channel = guild.channels.cache.get(channelID) as Discord.TextChannel

        if (!channel) {
            return null;
        }

        return await channel.send(message, menus);
    }

    /**
     * Reply to a Discord Message with Menu(s)
     * @static
     * @param {Discord.Message} msg
     * @param {string} message
     * @param {(DiscordMenus.MessageActionRow | DiscordMenus.MessageMenu)} menus
     * @return {*}  {(Promise<Discord.Message | Discord.Message[] | null>)}
     * @memberof MenuUtility
     */
    static async reply(msg: Discord.Message, message: string, menus: DiscordMenus.MessageActionRow | DiscordMenus.MessageMenu): Promise<Discord.Message | Discord.Message[] | null> {
        return MenuUtility.send(msg.channel.id, message, menus);
    }
}