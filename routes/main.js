"use strict";

module.exports = function (app){
    const express = require('express');
    const router = express.Router();

    router.all('/:controller?/:action?', function (request, response, next) {

        let requestController = request.params.controller || 'home';
        let requestAction = request.params.action || 'index';

        request.params.controller = requestController;
        request.params.action = requestAction;


        let controllerName = 'controllers' + '\\' + requestController + 'Controller';
        let fileController = __dirname + '\\' + controllerName + '.js';

        app.getController(fileController, function(err){

            if(err){
                console.log('--- CONTROLLER NOT FOUND : '+ controllerName +' ---');
                request.statusCode = 500;
                next(err);
            }
            else{
                console.log('--- CONTROLLER FOUND : ' + controllerName + ' ---');

                let controller = new (require('.' + '/' + controllerName))(request, response);
                if(!controller.callAction(requestAction)){

                    console.log('--- ACTION NOT FOUND : '+ requestAction +' ---');

                    request.statusCode = 404;
                    next();
                }
            }
        });

    });

    return router;
};
