/**
 *  Define local vars for the full app
 * @type {{env: string, website: string, adminEmail: string, currentYear: number}}
 */
module.exports = {
    env             : "dev",
    host            : "localhost",
    website         : "SpeedFinger",
    adminEmail      : "contact@chadasaid.net",
    currentYear     : (new Date()).getFullYear()
};