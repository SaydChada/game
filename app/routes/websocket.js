"use strict";

const socketIO = require('socket.io');

module.exports = function(server){

    console.log('--- SOCKET ENABLED ---');
    let socketIOWebSocketServer = socketIO.listen(server);

    socketIOWebSocketServer.on('connection', function (socket) {

        socket.on('squareCreated', function(data){
            socket.broadcast.emit('newSquareAdded', data);

        });

        socket.on('squareMove', function (data) {
            socket.broadcast.emit('squareHasMove', data);
        });

        socket.on('squareLeave', function(data){
            console.log('squareLeave: ' , data);
            socket.broadcast.emit('squareLeave', data)
        });
    });



    return socketIO;


};