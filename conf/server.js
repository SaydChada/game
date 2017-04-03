'use strict';

/**
 * Define server configuration
 * @type {{host: string, port: string, protocol: string, url: module.exports.url}}
 */
module.exports =  {
    host            : 'localhost',
    port            : '8080',
    protocol        : 'http',
    url             : function(){
        return this.protocol + '://' + this.host +':' + this.port;
    }
};