import * as Database from '@stuyk/ezmongodb';
import * as dotenv from 'dotenv';

import { IConfig } from '../interfaces/IConfig';
import { COLLECTIONS } from '../enums/collections';
import { IDatabase } from '../interfaces/IDatabase';

const DEFAULT_DATABASE_NAME = 'altv'
const config: IConfig = dotenv.config().parsed as IConfig;
let databaseCache: IDatabase;

export class DatabaseService {
    /**
     * Initializes the Database on Startup
     * @static
     * @memberof DatabaseService
     */
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

        const singleDocument = await Database.fetchAllData(COLLECTIONS.GENERAL)[0]
        if (!singleDocument) {
            databaseCache = await Database.insertData({}, COLLECTIONS.GENERAL, true);
        } else {
            databaseCache = singleDocument;
        }

        databaseCache._id = databaseCache._id.toString();
        console.log(`Connected to Database. Got ${Object.keys(databaseCache).length} Object Key(s).`);
    }

    /**
     * Updates the cache data and the data in the database.
     * @static
     * @param {IDatabase} partialData
     * @return {*} 
     * @memberof DatabaseService
     */
    static async updateData(partialData: IDatabase): Promise<boolean> {
        if (!databaseCache) {
            throw new Error(`Failed to create intitial Database Document`);
        }

        Object.keys(partialData).forEach(key => {
            databaseCache[key] = partialData[key];
        });

        return await Database.updatePartialData(databaseCache._id, {...partialData}, COLLECTIONS.GENERAL);
    }

    /**
     * Verifies that the data from the database has been placed into
     * the local cache.
     * @static
     * @return {*}  {Promise<boolean>}
     * @memberof DatabaseService
     */
    static async isDataReady(): Promise<boolean> {
        return new Promise((resolve: Function) => {
            const interval = setInterval(() => {
                if (!databaseCache) {
                    return;
                }

                resolve(true);
                clearInterval(interval);
                return;
            }, 25);
        });
    }

    /**
     * Returns the data currently in cache.
     * @static
     * @return {*}  {Promise<IDatabase>}
     * @memberof DatabaseService
     */
    static async getData(): Promise<IDatabase> {
        if (databaseCache) {
            return databaseCache;
        }

        await DatabaseService.isDataReady();
        return databaseCache;
    }
}