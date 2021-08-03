import * as Discord from'discord.js'

export default function generateEmbed(title: string, description: string): Discord.MessageEmbed {
    return new Discord.MessageEmbed({ title, description, color: '#008736' });
}