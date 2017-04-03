'use strict';

/**
 * Define server configuration
 * @type {{host: string, port: string, protocol: string, url: module.exports.url}}
 */
module.exports =  {
    host            : '127.0.0.1',
    port            : '3000',
    protocol        : 'http',
    url             : function(){
        return this.protocol + '://' + this.host +':' + this.port;
    }
};