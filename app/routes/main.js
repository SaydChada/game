"use strict";

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = function (app){
    const express   = require('express');
    const router    = express.Router();
    const path      = require('path');

    router.all('/:controller?/:action?', function (request, response, next) {

        let requestController = request.params.controller || 'homes';
        requestController = app.toControllerName(requestController);
        let requestAction = request.params.action || 'index';

        request.params.controller = requestController;
        request.params.action = requestAction;


        let controllerPath = path.join('app', 'controllers', requestController );
        let controllerModule = path.join('..', 'controllers', requestController );
        let controllerFile = controllerPath + '.js';

        app.getController(controllerFile, function(err){

            if(err){
                console.log('--- CONTROLLER NOT FOUND : '+ controllerPath + ' ---');
                console.error(err);
                response.status(404).render("static/404", { title : '404'});
            }
            else{
                console.log('--- CONTROLLER FOUND : ' + controllerPath + ' ---');

                let controller = new (require(controllerModule))(request, response);
                if(!controller.callAction(requestAction)){

                    console.log('--- ACTION NOT FOUND : '+ requestAction +' ---');
                    response.status(500).render("static/500", {title : '500'});

                }
            }
        });
    });

    return router;
};
