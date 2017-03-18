$(document).ready(function(){

    var server = $('#game').data('server');

    var socket = io.connect(server);

    socket.on('connect', function(data) {

        socket.emit('join', 'hi dude i just joined');

    });

    socket.on("disconnect", function(){
        socket.emit('disconnect', 'disconnected')
    });


    socket.on('clientLeave', function(data){
        console.log(data);
    })

});