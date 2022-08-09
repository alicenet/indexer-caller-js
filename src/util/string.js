/**
 * Removes trailing / from a string if applicable
 * @param {String} string - The string to remove trailing slash from
 */
module.exports.removeTrailingSlash = (string) => {
    if (string[string.length-1] === "/") {
        string = string.slice(0, string.length-1);
    }
    return string;
}