"use strict";

module.exports = function (app) {

    console.log('--- ROUTING STARTED ---');

    // Main routing config aka default routing (/controller/action)
    app.use('/', require('./app/routes/main')(app));
    // Handle ws
    app.socketIoStart =  require('./app/routes/websocket');

};