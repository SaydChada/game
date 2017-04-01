function socketLobbyEvents(socket){

    var $userList = $('#users_list');

    socket.on('connect', function() {
        socket.emit('userJoin', {socketId : socket.id});

    });


    socket.on('userLeave', function(data){
        var $userBlock = $("#" + data.userId);
        $userBlock && $userBlock.remove();
    });

    socket.on('userJoin', function(data){
        var userId = data.userId;
        var blockUser = data.template;

        // Check if block already exist then ifnot append it to parent
        var existingBlockUser = $('#' + userId).length;
        if(!existingBlockUser){
            $userList.append($(blockUser));
        }
    });

}