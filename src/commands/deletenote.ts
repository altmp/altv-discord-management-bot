import {ICommand} from "../interfaces/ICommand";
import Discord from "discord.js";
import {INote} from "../interfaces/INote";
import {DatabaseService} from "../service/database";
import generateEmbed from "../utility/embed";

const command: ICommand = {
    command: 'delnote',
    description: '!delnote [name] - Removes a note.',
    execute: async (msg: Discord.Message, name: string) => {
        let notes: INote[] = (await DatabaseService.getData()).notes;
        const query: INote = notes.find(note => note.name.toLowerCase() == name.toLowerCase())

        // Note doesnt exist
        if (query == null) {
            await msg.reply(generateEmbed("Error", `Note ${name} doesn't exist!`));
            return;
        }

        notes = notes.filter(note => note.name == name.toLowerCase());
        
        await DatabaseService.updateData({notes: notes});
        await msg.reply(generateEmbed("Success", `Note ${name} removed!`))
    }
}

export default command;