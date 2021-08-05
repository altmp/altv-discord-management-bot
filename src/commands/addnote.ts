import {ICommand} from "../interfaces/ICommand";
import Discord from "discord.js";
import {INote} from "../interfaces/INote";
import {DatabaseService} from "../service/database";
import generateEmbed from "../utility/embed";

const command: ICommand = {
    command: 'addnote',
    description: '!addnote [name] [Content] - Creates a new note from the specified content',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message, name: string) => {
        const notes: INote[] = (await DatabaseService.getData()).notes;
        const query: INote = notes.find(note => note.name.toLowerCase() == name.toLowerCase())
        
        // Note doesn't exist
        if (query == null) {
            await msg.reply(generateEmbed("Error", `Note ${name} does not exist!`));
            return;
        } 
        
        
        
    }
}

export default command;