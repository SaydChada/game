$(document).ready(function(){

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
    enableStatusChange(socket);

    /* ==========================================================================
     GAME
     ========================================================================== */
    socketGameEvents(socket);

});