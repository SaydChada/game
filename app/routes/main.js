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
                response.status(404).render("static/404", { title : 'ERROR :: 404'});
            }
            else{
                console.log('--- CONTROLLER FOUND : ' + controllerName + ' ---');

                let controller = new (require('.' + '/' + controllerName))(request, response);
                if(!controller.callAction(requestAction)){

                    console.log('--- ACTION NOT FOUND : '+ requestAction +' ---');
                    response.status(500).render("static/500");

                }
            }
        });
    });

    return router;
};
