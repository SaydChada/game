(function($){
    "use strict";

    $('.floating_alert').each(function(key, el){
        setTimeout(function(){
            $(el).fadeOut();
        }, 900)
    })

})(jQuery);