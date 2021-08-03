import * as DiscordButtons from 'discord-buttons';
import * as Discord from 'discord.js';
import { getGuild } from '../index';

export class ButtonUtility {
    /**
     * Create a new Button
     * @static
     * @return {*} 
     * @memberof ButtonUtility
     */
    static generate() {
        return new DiscordButtons.MessageButton();
    }

    /**
     * Combine Buttons into Single Row
     * @static
     * @param {Array<DiscordButtons.MessageButton>} buttons
     * @return {*}  {DiscordButtons.MessageActionRow}
     * @memberof ButtonUtility
     */
    static combine(buttons: Array<DiscordButtons.MessageButton>): DiscordButtons.MessageActionRow {
        const row = new DiscordButtons.MessageActionRow();
        row.addComponents(...buttons);
        return row;
    }

    /**
     * Send Button(s) to a Channel
     * @static
     * @param {string} channelID
     * @param {string} message
     * @param {(DiscordButtons.MessageActionRow | DiscordButtons.MessageButton)} buttons
     * @return {*}  {(Promise<Discord.Message | Discord.Message[] | null>)}
     * @memberof ButtonUtility
     */
    static async send(channelID: string, message: string, buttons: DiscordButtons.MessageActionRow | DiscordButtons.MessageButton): Promise<Discord.Message | Discord.Message[] | null> {
        const guild = getGuild();
        const channel = guild.channels.cache.get(channelID) as Discord.TextChannel

        if (!channel) {
            return null;
        }

        return await channel.send(message, buttons);
    }

    /**
     * Reply to a Discord Message with Button(s)
     * @static
     * @param {Discord.Message} msg
     * @param {string} message
     * @param {(DiscordButtons.MessageActionRow | DiscordButtons.MessageButton)} buttons
     * @return {*}  {(Promise<Discord.Message | Discord.Message[] | null>)}
     * @memberof ButtonUtility
     */
    static async reply(msg: Discord.Message, message: string, buttons: DiscordButtons.MessageActionRow | DiscordButtons.MessageButton): Promise<Discord.Message | Discord.Message[] | null> {
        return ButtonUtility.send(msg.channel.id, message, buttons);
    }
}