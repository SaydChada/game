$(document).ready(function(){

    // getting server
    var server = $('#game').data('server');

    var $userList = $('#users_list');
    var $statusMenu = $('#status_menu');

    /* ==========================================================================
     LOBBY
     ========================================================================== */

    var socket = io.connect(server);

    socket.on('connect', function() {

        socket.emit('userJoin');

    });


    socket.on('userLeave', function(data){
        var $userBlock = $("#" + data.userId);
        $userBlock && $userBlock.remove();
    });

    socket.on('userJoin', function(data){
        var userId = data.userId;
        var blockUser = data.template;


        var existingBlockUser = $('#' + userId).length;
        if(!existingBlockUser){
            $userList.append($(blockUser));
        }

    });


});