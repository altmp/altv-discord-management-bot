import * as Discord from 'discord.js';
import * as DiscordButtons from 'discord-buttons';

import { ICommand } from '../interfaces/ICommand';
import RegexUtility from '../utility/regex';
import { getGuild } from '../index';

const command: ICommand = {
    command: 'button',
    description: 'dsafsdafa',
    execute: async (msg: Discord.Message, user: string, reason: string) => {
       const btn = new DiscordButtons.MessageButton();
       
       btn.setLabel("This is a button!");
       btn.setID("myid")
       btn.setStyle("blurple");

       const guild = getGuild()
       const textChannel = guild.channels.cache.get('872092805407854592') as Discord.TextChannel;
       textChannel.send('test', btn)
    }   
}

export default command;