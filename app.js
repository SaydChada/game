/**
 *
 * @param routing callback router to handle app
 * @param localConf object with server, bdd and other conf
 */
function init(routing, localConf){
    "use strict";

    // Dependencies modules
    const express        = module.require('express');
    const session        = module.require('express-session');
    const cookieParser   = module.require('cookie-parser');
    const bodyParser     = module.require('body-parser');
    const path           = module.require('path');
    const methodOverride = module.require('method-override');
    const fs             = module.require('fs');
    const handlebars     = module.require('express-handlebars');
    const MongoStore     = module.require('connect-mongo')(session);
    const mongoose       = module.require('mongoose');
    const app            = express();

// Express config

    app.use( cookieParser(localConf.secrets.cookie) );
    app.use( express.Router() );
    app.use( bodyParser.json() );
    app.use( bodyParser.urlencoded({extended: true}) );
    app.use( methodOverride('_method') );

// View configuration
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');
    app.use( '/src', express.static( path.join( __dirname, 'src' ) ) );
    app.set( 'views', path.join( __dirname ,'src', 'views' ) );

// Session config
    console.log(localConf.bdd.url());
    mongoose.connect(localConf.bdd.url());
    app.use(session({
        secret: localConf.secrets.session,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        saveUninitialized : true,
        resave: true
    }));



    app.listen(localConf.server.port, localConf.server.host, function() {
        console.log('--- SERVER : ' + localConf.server.url() + ' ---');
    });

    app.getController = function(controllerName, callback){
        fs.access( controllerName, function(err){
            callback(err);
        });
    };

    routing(app);

}

module.exports = init;