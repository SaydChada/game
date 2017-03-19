module.exports =
    function getStatusLabel(status){
        let color = 'default';
        switch(status){
            case 'Occupé(e)' :
                color = 'warning';
                break;
            case 'En partie' :
                color = 'info';
                break;
            case 'Disponible' :
                color = 'success';
                break;
            case 'Hors ligne' :
                color = 'danger';
                break;
            default :
                color = "success";

        }
        return color;
    };