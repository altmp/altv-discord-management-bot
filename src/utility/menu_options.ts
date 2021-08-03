import * as DiscordMenus from 'discord-buttons';

export class MenuOptionsUtility {
    /**
     * Create a new Menu Option
     * @static
     * @return {*} 
     * @memberof MenuOptionsUtility
     */
    static generate() {
        return new DiscordMenus.MessageMenuOption();
    }
}