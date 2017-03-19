"use strict";

const socketIO      = require('socket.io');
const UserModel     = require('../models/Users').getMongooseModel();

module.exports = function(server, app){

    console.log('--- SOCKET ENABLED ---');
    let socketIo = socketIO.listen(server);

     // client aka socket : because more readable
    socketIo.on('connection', function (client) {

        client.on('userJoin', function(data) {

            let userId      = client.handshake.session.userId;
            let username    = client.handshake.session.passport.user;
            let status      = 'online';

            // Update user status
            UserModel.update({_id : userId}, {$set : {status: status}}, function(err, count){

                if(err){
                    throw err;
                }

                let dataTemplate = {
                    id : userId,
                    username : username,
                    status : status,
                    layout: false,
                    helpers : {getStatusLabel : require('../views/helpers/game/getStatusLabel')}
                };

                // Get template to send to all other clients
                app.render('game/partials/block_user', dataTemplate,  function(err, hbsTemplate){
                    if(err){
                        throw err;
                    }
                    client.broadcast.emit('userJoin', { userId : userId, template : hbsTemplate });
                });
            });
        });


        client.on('disconnect', function(data){
            let userId = client.handshake.session.userId;

            UserModel.update({_id : userId}, {$set : {status: 'offline'}}, function(err, count){

                if(err){
                    throw err;
                }
                client.broadcast.emit('userLeave', { userId : userId });

            });
        });


        client.on('statusChange', function(data){

            let userId = client.handshake.session.userId;
            client.broadcast.emit('userStatusChanged', { userId: userId, status: data})

        })

    });





    return socketIo;


};