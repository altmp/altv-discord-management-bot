import { IResponse } from "./IResponse";
import { LOG_TYPES } from '../enums/logTypes';
import { ILogBinding } from "./ILogBinding";

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

    /**
     * Bound Log Channels
     * @type {Array<ILogBinding>}
     * @memberof IDatabase
     */
    logBindings?: Array<ILogBinding>;
}