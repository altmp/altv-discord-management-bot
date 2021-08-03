export default class RegexUtility {
    /**
     * Check if its a Discord User ID.
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
     * Check if its a Discord Channel ID.
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
}