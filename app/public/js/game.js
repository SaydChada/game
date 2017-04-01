$(document).ready(function(){

    // Jquery elements
    var $userList = $('#users_list');
    var $maskCommands = $('#mask_commands');

    // socket connection
    var socket = io.connect($('#game').data('server'));

    /* ==========================================================================
     SEARCH BAR
     ========================================================================== */

    enableSearchBar();

    /* ==========================================================================
     LOBBY
     ========================================================================== */


    socketLobbyEvents(socket);

    /* ==========================================================================
     GAME
     ========================================================================== */

    socketGameEvents(socket);

    /* ==========================================================================
     DOM EVENTS
     ========================================================================== */


    // remove mask on cancel btn click
    $('#cancel_mask').on('click', function(e){
        e.preventDefault();
        $maskCommands.addClass('hidden');
    });

    // On click user display user's display mask with button handle event
    $userList.on('click','li:not(.bg-primary>li)',{}, function(){
        var $el = $(this);
        var id = $el.attr('id');
        var socketId = $el.data('socket-id');

        var $chalengeUser = $('#chalenge_user');
        var $viewStats    = $('#view_stats');

        // TODO fix event declaration outside $userList to prevent same event added multiple times
        // Clean events binded to buttons
        $chalengeUser.unbind('click');
        $viewStats.unbind('click');


        $chalengeUser.one('click', function(e){
            e.preventDefault();
            socket.emit('userRequestGame', {targetUser : id, targetSocketId : socketId});
            $maskCommands.addClass('hidden');
        });

        $viewStats.one('click', function(e){
           e.preventDefault();
           socket.emit('getUsersInfo', {targetUser: id}, function(response){
               $(response.template).modal('show');
           });
           $maskCommands.addClass('hidden');
        });

        $maskCommands.removeClass('hidden');

    });


    enableStatusChange(socket);



});