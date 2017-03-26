"use strict";

const ws            = require('socket.io');
const UserModel     = require('../models/Users').getMongooseModel();

module.exports = function(server, app){

    console.log('--- SOCKET ENABLED ---');
    let socketIo = ws.listen(server);

     // client aka socket : because more readable
    socketIo.on('connection', function (client) {

        // ONly available for logged in users
        if(!client.handshake.session.passport){
            return;
        }else{
            // Save socketId in database
            let user = client.handshake.session.passport.user;
            UserModel.update({ _id : user._id}, {$set : {socketId : client.id}},function(err){
            });
        }


        client.on('userJoin', function(data) {

            let status      = 'Disponible';
            let socketId    = data.socketId;
            let user = client.handshake.session.passport.user;

            // Update user status
            UserModel.update({_id : user._id}, {$set : {status: status}}, function(err, count){

                if(err){
                    throw err;
                }

                let dataTemplate = {
                    _id : user._id,
                    username : user.username,
                    socketId : socketId,
                    status : status,
                    layout: false,
                    helpers : {getStatusLabel : require('../views/helpers/game/getStatusLabel')}
                };

                // Get template to send to all other clients
                app.render('game/partials/block_user', dataTemplate,  function(err, hbsTemplate){
                    if(err){
                        throw err;
                    }
                    // Ugly way to fix userStatus refreshing TODO fix that
                    socketIo.emit('userFixStatus', { userId: user._id, template: hbsTemplate});
                    client.broadcast.emit('userJoin', { userId : user._id, template : hbsTemplate });
                });
            });
        });


        client.on('disconnect', function(data){
            // TODO fix bug that when user open two connexion dont remove it untill all co are removed
            let user = client.handshake.session.passport.user;

            UserModel.update({_id : user._id}, {$set : {status: 'Hors ligne', socketId : ''}}, function(err, count){

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
        });

        client.on('userRequestGame', function(data){

            if(client.room){
                socketIo.to(client.id).emit('currentRequestPending', {error : 'Un challenge est déjà en cours'});
            }

            let user = client.handshake.session.passport.user;
            let currentUserId = user._id;
            let targetUserId = data.targetUser;
            let targetSocketId = data.targetSocketId;
            let challengerName = user.username;

            let roomName = + new Date();
            client.room = roomName;
            client.join(roomName);

            client.to(targetSocketId).emit('requestGame', {
                targetUserId : targetUserId,
                targetSocketId : targetSocketId,
                roomName     : roomName,
                fromSocketId : client.id,
                fromUserId : currentUserId,
                fromUsername : challengerName
            });

        });

        client.on('acceptGame', function(data){

            client.room = data.roomName;
                client.join(data.roomName, function(){
                    socketIo.sockets.in(data.roomName).emit('StartGame', {roomName : data.roomName});
                });
        });

        /**
         * Where userRequestGame bein rejected
         */
        client.on('rejectGame', function(data){
            // Remove roomName
           socketIo.of('/').connected[data.fromSocketId].room = null;

           socketIo.to(data.fromSocketId).emit('challengeWasRejected', {fromUserName : data.fromUserName});
        });



    });





    return socketIo;


};