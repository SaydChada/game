
function socketGameEvents(socket){

    var $maskCommands = $('#mask_commands');
    var $maskChallenge = $('#mask_challenge');

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
    });

    socket.on('gameInitiliazed', function(data){
        console.log('gameInitiliazed', data);
    });

}