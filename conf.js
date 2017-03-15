'use strict';
module.exports = {
    locals  : module.require('./conf/locals'),
    env     : process.env["NODE_ENV"] || 'dev',
    hbs     : module.require('./conf/handlebars'),
    bdd     : module.require('./conf/database'),
    server  : module.require('./conf/server'),
    secrets : module.require('./conf/secrets')
};