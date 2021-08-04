export default class RegexUtility {
    /**
     * Convert a user tag to an ID if necessary.
     * @static
     * @param {string} id
     * @return {*}  {string}
     * @memberof RegexUtility
     */
    static parseUserID(id: string): string {
        const idRegex = /<@!?(\d+)>/g;
        const idRegexResult = idRegex.exec(id);
        return idRegexResult ? idRegexResult[1] : id;
    }

    /**
     * Convert a channel tag to an ID if necessary.
     * @static
     * @param {string} id
     * @return {*}  {string}
     * @memberof RegexUtility
     */
    static parseChannelID(id: string): string {
        const idRegex = /<#(\d+)>/g;
        const idRegexResult = idRegex.exec(id);
        return idRegexResult ? idRegexResult[1] : id;
    }

    /**
     * Convert a role tag to an ID if necessary.
     * @static
     * @param {string} id
     * @return {*}  {string}
     * @memberof RegexUtility
     */
    static parseRoleID(id: string): string {
        const idRegex = /<@&(\d+)>/g;
        const idRegexResult = idRegex.exec(id);
        return idRegexResult ? idRegexResult[1] : id;
    }
}