import * as dotenv from 'dotenv';

import { IConfig } from '../interfaces/IConfig';

const config: IConfig = dotenv.config().parsed as IConfig;
const DEFAULT_PREFIX = '+';

let prefix;

export default function getPrefix(): string {
    if (prefix) {
        return prefix;
    }

    let commandPrefix: string;

    if (config.PREFIX) {
        commandPrefix = config.PREFIX;
    } else if (process.env.PREFIX) {
        commandPrefix = process.env.PREFIX;
    } else {
        commandPrefix = DEFAULT_PREFIX
    }

    prefix = commandPrefix;
    return prefix;
}