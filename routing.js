"use strict";

module.exports = function (app) {
    console.log('--- ROUTING STARTED ---');
    // Main routing config
    app.use('/', module.require('./routes/main')(app));
    // Handle ws
    module.require('./routes/websocket');

    //Handle server errors
    app.use(module.require('./routes/errors'));


};