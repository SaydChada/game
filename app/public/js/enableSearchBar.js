/**
 * User list.js lib to allow user filtering lobby by string
 */
function enableSearchBar(){
    $('#custom-search-input').on('click', function(e){
        $(this).children('input').val('');
    });

    var options = {
        valueNames: [ 'username' ]
    };
    new List('block_list', options);

}