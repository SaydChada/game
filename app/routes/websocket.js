"use strict";

const socketIO      = require('socket.io');
const UserModel     = require('../models/Users').getMongooseModel();

module.exports = function(server, app){

    console.log('--- SOCKET ENABLED ---');
    let socketIo = socketIO.listen(server);

     // client aka socket : because more readable
    socketIo.on('connection', function (client) {

        // ONly available for logged in users
        if(!client.handshake.session.passport){
            return;
        }


        client.on('userJoin', function(data) {

            let status      = 'Disponible';
            let user = client.handshake.session.passport.user;

            // Update user status
            UserModel.update({_id : user._id}, {$set : {status: status}}, function(err, count){

                if(err){
                    throw err;
                }

                let dataTemplate = {
                    _id : user._id,
                    username : user.username,
                    status : status,
                    layout: false,
                    helpers : {getStatusLabel : require('../views/helpers/game/getStatusLabel')}
                };

                // Get template to send to all other clients
                app.render('game/partials/block_user', dataTemplate,  function(err, hbsTemplate){
                    if(err){
                        throw err;
                    }
                    client.broadcast.emit('userJoin', { userId : user._id, template : hbsTemplate });
                });
            });
        });


        client.on('disconnect', function(data){
            // TODO fix bug that when user open two connexion dont remove it untill all co are removed
            let user = client.handshake.session.passport.user;

            UserModel.update({_id : user._id}, {$set : {status: 'Hors ligne'}}, function(err, count){

                if(err){
                    throw err;
                }
                client.broadcast.emit('userLeave', { userId : user._id });

            });
        });


        client.on('userStatusChange', function(data){

            let user = client.handshake.session.passport.user;
            let cssClass = 'label-' + require('../views/helpers/game/getStatusLabel')(data.newStatus);

            UserModel.update({_id : user._id}, {$set : {status: data.newStatus}}, function(err, count){

                if(err){
                    throw err;
                }
                socketIo.emit('userStatusChanged', { userId: user._id, newStatus: data.newStatus, cssClass : cssClass });

            });



        })

    });





    return socketIo;


};