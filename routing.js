"use strict";

module.exports = function (app) {
    console.log('--- ROUTING STARTED ---');
    // Main routing config
    app.use('/', module.require('./app/routes/main')(app));
    // Handle ws
    app.use(module.require('./app/routes/websocket'));

};