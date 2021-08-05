import { IResponse } from "./IResponse";
import { LOG_TYPES } from '../enums/logTypes';
import { ILogBinding } from "./ILogBinding";
import { IReactRole } from "./IReactRole";
import { ILockdown } from "./ILockdown";
import { ICommandBinding } from "./ICommandBinding";
import {INote} from "./INote";

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
     * List of commands with specific roles bound to them.
     * @type {Array<ICommandBinding>}
     * @memberof IDatabase
     */
    commandBindings?: Array<ICommandBinding>

    /**
     * Reaction Roles
     * @type {Array<IReactRole>}
     * @memberof IDatabase
     */
    reactRoles?: Array<IReactRole>;

    /**
     * Lockdown Cahnnel
     * @type {Array<ILockdown>}
     * @memberof IDatabase
     */
    lockdownChannel?: Array<ILockdown>;

    /**
     * Notes
     * @type {Array<INote>}
     * @memberOf IDatabase
     */
    notes?: Array<INote>;
}