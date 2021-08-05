import * as Discord from 'discord.js';

import { ICommand } from '../interfaces/ICommand';
import generateEmbed from '../utility/embed';

const command: ICommand = {
    command: 'patreon',
    description: 'Link to Patreon.',
    skipPermissionCheck: true,
    execute: async (msg: Discord.Message) => {
        const embed = generateEmbed(
            'Support the Development of alt:V',
            'The developers behind alt:V work very hard on ensuring you get the best experience while playing on alt:V. If you wish to support the work that goes into alt:V please consider becoming a Patreon Subscriber!\n https://www.patreon.com/altVMP'
        );

        msg.reply(embed);
    },
};

export default command;
