module.exports =
    function getStatusLabel(status){
        let color = 'default';
        switch(status){
            case 'ingame' :
                color = 'warning';
                break;
            case 'online' :
                color = 'success';
                break;
            default :
                color = "success";

        }
        return color;
    };