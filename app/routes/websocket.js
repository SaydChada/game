"use strict";

const socketIO = require('socket.io');

module.exports = function(server){

    console.log('--- SOCKET ENABLED ---');
    let socketIo = socketIO.listen(server);


     // client aka socket : because more readable
    socketIo.on('connection', function (client) {


        client.on('join', function(data) {
            console.log('session', client.handshake.session);
            console.log(data);
        });

        client.on('disconnect', function(data){
            console.log('coucou');
            socketIo.emit('clientLeave', {client_id : '3'});
        });

        client.on('squareCreated', function(data){
            socket.broadcast.emit('newSquareAdded', data);

        });

        client.on('squareMove', function (data) {
            socket.broadcast.emit('squareHasMove', data);
        });

        client.on('squareLeave', function(data){
            console.log('squareLeave: ' , data);
            socket.broadcast.emit('squareLeave', data)
        });
    });



    return socketIo;


};