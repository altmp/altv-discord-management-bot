import * as Database from '@stuyk/ezmongodb';
import * as dotenv from 'dotenv';

import { IConfig } from '../interfaces/IConfig';
import { COLLECTIONS } from '../enums/collections';

const DEFAULT_DATABASE_NAME = 'altv'
const config: IConfig = dotenv.config().parsed as IConfig;

export class DatabaseService {
    static async init() {
        let url: string;

        if (config.DATABASE_URL) {
            url = config.DATABASE_URL;
        } else if (process.env.DATABASE_URL) {
            url = process.env.DATABASE_URL
        } else {
            throw new Error(`Did not specify DATABASE_URL `)
        }

        const didInit = await Database.init(url, DEFAULT_DATABASE_NAME, [COLLECTIONS.GENERAL]);

        if (!didInit) {
            throw new Error(`Could not connect to database. Bad URL`);
        }

        console.log(`Connected to Database Successfully`);
    }
}