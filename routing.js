"use strict";

module.exports = function (app) {

    console.log('--- ROUTING STARTED ---');

    // Main routing config aka default routing (/controller/action)
    app.use('/', require('./app/routes/main')(app), (req, res, next) => {
        console.log('flash content', req.session.flashMessages);
            res.locals.flashMessages = req.session.flashMessages;
            req.session.flashMessages = [];
    });

    // Handle ws
    app.socketIoStart =  require('./app/routes/websocket');

};