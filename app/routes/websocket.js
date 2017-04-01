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


        /**
         * When user join lobby
         */
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
                    socketIo.to(client.id).emit('userFixStatus', { userId: user._id, template: hbsTemplate});
                    client.broadcast.emit('userJoin', { userId : user._id, template : hbsTemplate });
                });
            });
        });


        /**
         * When user leave
         */
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


        /**
         * When user change his status
         */
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

        /**
         * When user request game with another user
         */
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
                targetUserId    : targetUserId,
                targetSocketId  : targetSocketId,
                roomName        : roomName,
                fromSocketId    : client.id,
                fromUserId      : currentUserId,
                fromUsername    : challengerName
            });

        });

        /**
         * When a game is accepted
         */
        client.on('acceptGame', function(data){

            client.room = data.roomName;
                client.join(data.roomName, function(){
                    socketIo.sockets.in(data.roomName).emit('StartGame', data);
                });
        });

        /**
         * When a game in room start
         */
        socketIo.sockets.in(client.room).on('startGame', function(data){

            let colors = ['warning','info', 'success', 'primary', 'danger'];

            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    let temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
                return array;
            }

            colors = shuffleArray(colors);

            socketIo.sockets.in(client.room).emit('gameInitiliazed', {colors : colors});


        });

        /**
         * When user in room is ready
         */
        socketIo.sockets.in(client.room).on('userReady', function(){

        });

        /**
         * When userRequestGame bein rejected
         */
        client.on('rejectGame', function(data){

            // Remove roomName and leave
            let targetSocket = socketIo.of('/').connected[data.fromSocketId];
            targetSocket.leave(targetSocket.room);
            targetSocket.room = null;
            client.leave(client.room);
            client.room = null;

           socketIo.to(data.fromSocketId).emit('challengeWasRejected', {fromUserName : data.fromUserName});
        });


        client.on('getUsersInfo', function(data, callback){

            UserModel.findOne({_id : data.targetUser}, function(err, user){
                if(err){
                    throw err;
                }

                let dataTemplate = {
                    username : user.username,
                    status : user.status,
                    email : user.email,
                    games : user.games,
                    layout: false,
                };

                // Get template for the modal which contain data
                app.render('game/partials/modal_user_data', dataTemplate,  function(err, hbsTemplate){
                    if(err){
                        throw err;
                    }
                    callback({template : hbsTemplate});
                });

            });
        })
    });

    return socketIo;
};