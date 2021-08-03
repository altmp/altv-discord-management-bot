import { IResponse } from "./IResponse";

/**
 * Default Data Layer for Database
 * Append Additional Stored Data Here
 * @export
 * @interface IDatabase
 */
export interface IDatabase {
    /**
     * The Database ID associated with the Document.
     * @type {unknown}
     * @memberof IDatabase
     */
    _id?: unknown;

    /**
     * Custom command responses.
     * @type {Array<IResponse>}
     * @memberof IDatabase
     */
    responses?: Array<IResponse>;
}