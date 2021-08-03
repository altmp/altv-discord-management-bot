/**
 * Commands work as follows:
 * 1. Command(s) have roles assigned to them.
 * 2. Any command without a role is Admin only.
 * 3. Any command with a role is that role as well as Admin.
 * 4. Any command marked with the allAccess boolean is available to everyone.
 * @export
 * @interface ICommandBinding
 */
export interface ICommandBinding {
    /**
     * The name of the command.
     * @type {string}
     * @memberof ICommandBinding
     */
    command: string;
    
    /**
     * Roles that can use this command.
     * @type {string}
     * @memberof ICommandBinding
     */
    roles: Array<string>;
}
