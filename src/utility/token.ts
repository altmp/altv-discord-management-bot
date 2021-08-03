import * as dotenv from 'dotenv';

import { IConfig } from '../interfaces/IConfig';

const config: IConfig = dotenv.config().parsed as IConfig;

export default function getToken(): string {
    if (process.env.DISCORD_BOT_TOKEN) {
        return process.env.DISCORD_BOT_TOKEN
    }

    if (config.DISCORD_BOT_TOKEN) {
        return config.DISCORD_BOT_TOKEN;
    }

    throw new Error(`DISCORD_BOT_TOKEN was not specified as an environment variable.`);
}