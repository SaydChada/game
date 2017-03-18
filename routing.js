"use strict";

module.exports = function (app) {

    console.log('--- ROUTING STARTED ---');

    // Handle ws
    app.socketIoStart =  require('./app/routes/websocket');

    let flashKeepOnRedirect = require('./middlewares/flashKeepOnRedirect');
    let serverErrorHandler  = require('./app/routes/errors');

    // Main routing config aka default routing (/controller/action)
    app.use('/', require('./app/routes/main')(app),serverErrorHandler, flashKeepOnRedirect);

};