$(document).ready(function(){

    // getting server
    var server = $('#game').data('server');

    // Jquery elements
    var $userList = $('#users_list');
    var $statusMenu = $('#status_menu');
    var $inputSearch = $('#search_input');
    var $btnSearch =   $('#search_submit');

    /* ==========================================================================
     SEARCH BAR
     ========================================================================== */

    $btnSearch.on('click', function(e){
        e.preventDefault();
        var search = $inputSearch.val();

        $('.block_user', $userList).each(function(i, el){

            var $el = $(el);
            if(search.trim() === ''){
                $el.show();
            }else{
                // Hide only those who didn't have div as parent (only ul>li not ul li)
                $el.hide();
            }
        });

        $userList.find('li:contains("'+search+'")').show();
    });


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


    // Attach event to all li in status change menu
    $('li', $statusMenu).each(function(i, el){

        var $el = $(el);
        $el.on('click', function(e){
            e.preventDefault();
            var newStatus = $el.data('status');
            console.log(newStatus);

            socket.emit('userStatusChange', {newStatus : newStatus});



        })
    });


});