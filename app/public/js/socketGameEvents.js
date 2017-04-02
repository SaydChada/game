
function socketGameEvents(socket){

    var $maskCommands = $('#mask_commands');
    var $maskChallenge = $('#mask_challenge');

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
        console.log(data);
        socket.emit('startGame', data);
        $('#game_start_block').removeClass('invisible');
    });

    socket.on('gameWillBegin', function(data){
        console.log('gameInitiliazed', data);
    });

}