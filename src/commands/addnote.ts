import {ICommand} from "../interfaces/ICommand";
import Discord from "discord.js";
import {INote} from "../interfaces/INote";
import {DatabaseService} from "../service/database";
import generateEmbed from "../utility/embed";

const command: ICommand = {
    command: 'addnote',
    description: '!addnote [name] [Content] - Creates a new note from the specified content',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message, name: string, ...content: string[]) => {
        const notes: INote[] = (await DatabaseService.getData()).notes;
        const query: INote = notes.find(note => note.name.toLowerCase() == name.toLowerCase())

        // Note exists already
        if (query != null) {
            await msg.reply(generateEmbed("Error", `Note ${name} already exists!`));
            return;
        }

        notes.push({name: name, response: content.join(' ')})
        await DatabaseService.updateData({notes: notes});
        await msg.reply(generateEmbed("Success", `Note ${name} added!`))
        
        
        
    }
}

export default command;