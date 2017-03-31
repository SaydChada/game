$(document).ready(function(){

    // getting server
    var server = $('#game').data('server');

    // Jquery elements
    var $userList = $('#users_list');
    var $statusMenu = $('#status_menu');
    var $maskCommands = $('#mask_commands');
    var $maskChallenge = $('#mask_challenge');
    var $rooms = $('#rooms');

    /* ==========================================================================
     SEARCH BAR
     ========================================================================== */

    $('#custom-search-input').on('click', function(e){
        $(this).children('input').val('');
    });

    var options = {
        valueNames: [ 'username' ]
    };
    new List('block_list', options);

    /* ==========================================================================
     LOBBY
     ========================================================================== */


    var socket = io.connect(server);

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

    socket.on('userStatusChanged', function(data){
        var userId   = data.userId;
        var status   = data.newStatus;
        var cssClass = data.cssClass;
        var $blockUser = $('#' + userId);

        var $spanLabel = $('.status_label', $blockUser);

        $spanLabel.removeClass('label-warning label-info label-success label-danger');
        $spanLabel.addClass(cssClass);
        $spanLabel.html(status);

    });

    socket.on('userFixStatus', function(data){

        var userId = data.userId;
        var blockUser = data.template;

        var existingBlockUser = $('#' + userId);
        if(existingBlockUser.length){
            existingBlockUser.replaceWith($(blockUser));
        }

    });

    /* ==========================================================================
     GAME
     ========================================================================== */


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

    // Attach event to all li in status change menu
    $('li', $statusMenu).each(function(i, el){
        var $el = $(el);
        $el.on('click', function(e){
            e.preventDefault();
            var newStatus = $el.data('status');
            socket.emit('userStatusChange', {newStatus : newStatus});
        })
    });

    socket.on('requestGame', function(data){
        $('#challenger_name').html(data.fromUsername);

        $('#deny_challenge').on('click', function(e){
            e.preventDefault();
            $('#challenger_name').html('');
            socket.emit('rejectGame', data);
           $maskChallenge.addClass('hidden');
        });

        $('#accept_challenge').on('click', function(e){
            e.preventDefault();
            $('#challenger_name').html('');
            socket.emit('acceptGame', data);
            $maskChallenge.addClass('hidden');

        });

        $maskCommands.addClass('hidden');
        $maskChallenge.removeClass('hidden');

    });

    socket.on('StartGame', function(data){
        console.log(data);
        $('#game_start_block').removeClass('invisible');
    })


});