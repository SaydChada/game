"use strict";

module.exports = function (app) {

    app.use('/', module.require('./routes/main')(app));

    module.require('./routes/websocket');

    //Handle server errors
    app.use(module.require('./routes/errors'));

};