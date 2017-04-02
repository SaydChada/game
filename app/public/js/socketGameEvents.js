
function socketGameEvents(socket){

    var $maskCommands = $('#mask_commands');
    var $maskChallenge = $('#mask_challenge');
    var $gameUserChoices = $('#game_user_choice');
    var clickedColors = [];
    var colorsCombinaison = [];
    var lastRemovedIndexes = [];

    socket.on('userLeaveRoom', function(data){
        alert('"'+ data.username +'" a quitté la partie');
        $('#block_vs').length && $('#block_vs').remove();
    });

    /* ==========================================================================
     Challenge events
     ========================================================================== */

    socket.on('userAlreadyInGame', function(data){
        // alert('"' + data.fromUsername + '" est en pleine partie !!');
        console.log(data);
    });

    socket.on('requestGame', function(data){
        $('#challenger_name').html(data.fromUsername);

        var $acceptBtn = $('#accept_challenge');
        var $rejectBtn = $('#deny_challenge');


        $rejectBtn.unbind('click');
        $acceptBtn.unbind('click');

        $rejectBtn.one('click', function(e){
            e.preventDefault();
            $('#challenger_name').html('');
            socket.emit('rejectGame', data);
            $maskChallenge.addClass('hidden');
        });

        $acceptBtn.one('click', function(e){
            e.preventDefault();
            $('#challenger_name').html('');
            socket.emit('acceptGame', data);
            $maskChallenge.addClass('hidden');

        });

        $maskCommands.addClass('hidden');
        $maskChallenge.removeClass('hidden');

    });

    socket.on('challengeWasRejected', function(data){
        alert('"' + data.fromUsername + '" a rejeté votre défi !!');
    });

    socket.on('challengeWasAccepted', function(data){

        $('#game_start_block').prepend($(data.template));

        socket.emit('gameWillBegin', data);
    });


    socket.on('gameTimer', function(data){

        console.log(data.countdown);
        if(data.countdown === 0){
            $('#countdown_block').remove();

            socket.emit('gameStart', true);
        }else{
            $('#countdown').html(data.countdown);
        }
    });

    socket.on('gameBegin', function(data){
        $('#game_combinaison').append($(data.template));
    });


    /* ==========================================================================
     DOM EVENTS
     ========================================================================== */

    $('.btn', '#game_user_choice').on('click', function(){

        console.log('clickedColors', clickedColors);

        var color = $(this).data('color');

        // Get indexOf color (-1 if not found)
        var checkColorInArray = clickedColors.indexOf(color);

        console.log('checkColorInArray : ', checkColorInArray);
        if(checkColorInArray === -1){

            if(lastRemovedIndexes[0]){
                clickedColors[lastRemovedIndexes[0] -1] = color;
                $(this).html(lastRemovedIndexes[0]);
                lastRemovedIndexes.shift();

            }else{
                clickedColors.push(color);
                $(this).html(clickedColors.length);
            }

            lastRemovedIndex = null;

            if(clickedColors.length === 5){

                socket.emit('checkUserColors',
                    {usersColors : clickedColors, colorsCombinaison : colorsCombinaison},
                    function(response){
                    if(response){
                        socket.emit('endGame', {});
                    }else{

                        $gameUserChoices.hasClass('bg-danger') || $gameUserChoices.addClass('bg-danger');
                    }
                });
            }else{
                $gameUserChoices.hasClass('bg-danger') && $gameUserChoices.removeClass('bg-danger');
            }

            console.log('clickedColors::push', clickedColors);
        }else{
            lastRemovedIndexes.push($(this).html());
            $(this).html('?');
            clickedColors[checkColorInArray] = null;
            // Sort array to always have the wright order for user
            lastRemovedIndexes.sort();
            console.log('clickedColors::splice', clickedColors);
        }

    })

}