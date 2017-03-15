/**
 *
 * @param routing callback router to handle app
 * @param localConf object with server, bdd and other conf
 */
function init(routing, localConf){
    "use strict";

    // Dependencies modules
    const express        = require('express');
    const session        = require('express-session');
    const cookieParser   = require('cookie-parser');
    const bodyParser     = require('body-parser');
    const path           = require('path');
    const methodOverride = require('method-override');
    const fs             = require('fs');
    const handlebars     = require('express-handlebars');
    const MongoStore     = require('connect-mongo')(session);
    const mongoose       = require('mongoose');
    const app            = express();
    const socketIo       = require('socket.io');

// Express config

    app.use( cookieParser(localConf.secrets.cookie) );
    app.use( express.Router() );
    app.use( bodyParser.json() );
    app.use( bodyParser.urlencoded({extended: true}) );
    app.use( methodOverride('_method') );
    app.locals = localConf.locals;

// View configuration

    // Set directories
    app.set( 'views', path.join( __dirname, './app/views' ) );
    app.set('layouts', path.join( app.get('views'), 'layouts'));
    app.use( '/public', express.static( path.join( __dirname, 'public' ) ) );

    // Configure handlebars && Set as default engine, merge with global helpers
    let hbsConf = Object.assign(require('./app/views/helpers/global'), localConf.hbs);
    app.engine('hbs', handlebars(hbsConf));
    app.set('view engine', 'hbs');
    app.enable('view cache');

// Session config
    mongoose.connect(localConf.bdd.url());
    app.use(session({
        secret: localConf.secrets.session,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        saveUninitialized : true,
        resave: true
    }));

    app.listen(localConf.server.port, localConf.server.host, function() {
        routing(app);
    });

    app.getController = function(controllerName, callback){
        fs.access( controllerName, function(err){
            callback(err);
        });
    };

}

module.exports = init;