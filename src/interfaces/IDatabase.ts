import { IResponse } from "./IResponse";
import { LOG_TYPES } from '../enums/logTypes';
import { ILogBinding } from "./ILogBinding";
import { IReactRole } from "./IReactRole";
import { ICommandBinding } from "./ICommandBinding";

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

    /**
<<<<<<< HEAD
     * React Roles
=======
     * List of commands with specific roles bound to them.
     * @type {Array<ICommandBinding>}
     * @memberof IDatabase
     */
    commandBindings?: Array<ICommandBinding>

    /**
     * Reaction Roles
>>>>>>> 69d14f1aa83761a34e99456abb5e8569f2b72241
     * @type {Array<IReactRole>}
     * @memberof IDatabase
     */
    reactRoles?: Array<IReactRole>;
}