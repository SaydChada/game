'use strict';
module.exports = {
    bdd : {
        host        : 'localhost',
        port        : '27017',
        protocol    : 'mongodb',
        database    : 'game',
        url         : function(){
            return this.protocol + '://' + this.host +':' + this.port + '/' + this.database;
        }
    },
    server: {
        host            : 'localhost',
        port            : '8888',
        protocol        : 'http',
        url             : function(){
            return this.protocol + '://' + this.host +':' + this.port;
        }
    },
    secrets:
        {
            cookie  : "regr5e9g4-re9g8",
            session : "'rez98f79r87-2'"
        }

};