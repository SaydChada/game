"use strict";

const ws            = require('socket.io');
const UserModel     = require('../models/Users').getMongooseModel();
const GameModel     = require('../models/Games').getMongooseModel();

module.exports = function(server, app){

    console.log('--- SOCKET ENABLED ---');
    let socketIo = ws.listen(server);

    socketIo.set('heartbeat timeout', 2000);
    socketIo.sockets.setMaxListeners(0);


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
        client.on('userJoin', function(data, callback) {

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

                    // Fix client status after change (because passport lose last information)
                    callback({ userId: user._id, template: hbsTemplate});
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

                // If user was in room
                if(client.room){
                    let data = {
                        userId :user._id, username : user.username, userSocketId : client.id,
                    };
                    socketIo.sockets.in(client.room).emit('userLeaveRoom', data);
                }

                // Also broadcast to all users to update lobby players list
                client.broadcast.emit('userLeave', { userId : user._id });

            });
        });


        /**
         * When user change his status
         * TODO bug front user have to change twice before dom change
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

            let targetSocket = socketIo.of('/').connected[data.targetSocketId];
            if(targetSocket && targetSocket.room){
                socketIo.to(client.id).emit('userAlreadyInGame', {error : 'Un challenge est déjà en cours'});
                return;
            }

            let user = client.handshake.session.passport.user;

            let roomName = + new Date();
            client.room = roomName;
            client.isPlayer = 'p1';
            client.gameMetaData = {
                roomName : client.room,
                p1 : {id : user._id, username : user.username, socket : client.id},
                p2 : {id : data.targetUser, username : data.targetUsername, socket : data.targetSocketId}
            };

            client.join(roomName);

            data = {
                targetUserId    : data.targetUser,
                targetSocketId  : data.targetSocketId,
                targetUsername  : data.targetUsername,
                roomName        : roomName,
                fromSocketId    : client.id,
                fromUserId      : user._id,
                fromUsername    : user.username
            };

            client.to(data.targetSocketId).emit('requestGame', data);

        });

        /**
         * When a game is accepted
         * P1 challenger and P2 the one who accept the challenge
         */
        client.on('acceptGame', function(data){

            data = {
                roomName : data.roomName,
                p1 : {id : data.fromUserId, username : data.fromUsername, socket : data.fromSocketId},
                p2 : {id : data.targetUserId, username : data.targetUsername, socket : data.targetSocketId}
            };

            client.room = data.roomName;

            // Set meta data to be saved after game end
            client.gameMetaData         = data;
            client.isPlayer             = 'p2';

            // Joining room
            client.join(client.room, function(){

                let dataTemplate =  {layout : false, data};

                // Update both users status
                let status = 'En partie';
                UserModel.update({_id : {$in : [data.p1.id, data.p2.id]}}, {$set : {status: status}},
                    function(err, count){
                        if(err){
                            throw err;
                        }

                        let cssClass = 'label-' + require('../views/helpers/game/getStatusLabel')(status);
                        socketIo.emit('userStatusChanged', { userId : data.p1.id, newStatus : status, cssClass : cssClass });
                        socketIo.emit('userStatusChanged', { userId : data.p2.id, newStatus : status, cssClass : cssClass });
                    });


                // Rendering block versus (with name and timer)
                app.render('game/partials/block_vs', dataTemplate,  function(err, hbsTemplate){
                    if(err){
                        throw err;
                    }

                    data.template = hbsTemplate;
                    socketIo.sockets.in(data.roomName).emit('challengeWasAccepted', data);
                });
            });
        });


        /**
         * Before game start display countdown and get array shuffled
         */
        client.on('gameWillBegin', function(){

            // TODO array colors here and pass it to clients
            let countdown = 10;

            let interval = setInterval(function() {
                if(countdown === 0){
                    clearInterval(interval);
                }else{
                    countdown--;
                    socketIo.to(client.id).emit('gameTimer', { countdown: countdown });
                }

            }, 1000);
        });

        /**
         * When a game in room start
         */
        client.on('gameStart', function(data){

            // Colors to display to end user
            let colors = ['warning','info', 'success', 'primary', 'danger'];

            // Shuffle colors
            function shuffleArray(array) {
                for (let i = array.length -1 ; i > 0; i--) {
                    let j = Math.floor(Math.random() * i);
                    let temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
                return array;
            }

            client.gameColors = shuffleArray(colors);
            let dataTemplate = {colors : client.gameColors, layout : false};

            // Rendering block combinaison (the real game begin)
            app.render('game/partials/block_combinaison', dataTemplate,  function(err, hbsTemplate){
                if(err){
                    throw err;
                }

                socketIo.to(client.id).emit('gameBegin', {template : hbsTemplate, colors : client.gameColors});
            });
        });


        /**
         * Check if user choice match gameColors
         */
        client.on('checkUserColors', function(data, callback){

            if(client.room && client.gameColors){

                if(data.userColors.join() == client.gameColors.join()){
                    callback(true);
                    client.winTheGame = true;
                    socketIo.sockets.in(client.room).emit('gameFinished', {winner : client.id});
                }else{
                    callback(false)
                }
            }
        });

        client.on('afterGameFinished', function(){

            let score = client.winTheGame ? 1 : 0;
            let p1_score;
            let p2_score;

            // If current client is player 1 so score p1 = his score
            // Else his score = p2 score
            if(client.isPlayer === 'p1'){
                p1_score = score;
                p2_score = + !score;

            }else{
                p1_score = + !score;
                p2_score = score;
            }

            //TODO fix double gameSave if game already exist for current room, then dont save it
            // Maybe if only winner save the game like client.winTheGame && save for p1 and p2 and update both
            let game = new GameModel();
            let newStatus = 'Disponible';

            game.room_name = client.gameMetaData.roomName;
            game.p1 = client.gameMetaData.p1.id;
            game.p2 = client.gameMetaData.p2.id;
            game.p1_score = p1_score;
            game.p2_score = p2_score;
            game.save(function(err, newGame){
                if(err){
                    throw err;
                }
                // Update user total score
                UserModel.update({ _id : client.gameMetaData[client.isPlayer].id},
                    {$inc: {total_score: score}, $push :{ games : newGame}, $set : {status : newStatus} },
                    function(err){
                        if(err){
                            throw err;
                        }
                        // Change users status to available
                        let cssClass = 'label-' + require('../views/helpers/game/getStatusLabel')(newStatus);
                        socketIo.emit('userStatusChanged', { userId :game.p1, newStatus : newStatus, cssClass: cssClass });
                        socketIo.emit('userStatusChanged', { userId : game.p2, newStatus : newStatus, cssClass: cssClass });
                    });
            });
            // Reset client room
            client.room = null;

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

            socketIo.to(data.fromSocketId).emit('challengeWasRejected',  data);
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
                    total_score : user.total_score,
                    games : user.games.length,
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