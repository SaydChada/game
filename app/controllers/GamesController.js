const baseController = require('./baseController');

class GamesController extends baseController{
    constructor(req, res, next){
        super(req, res, next);
        this.viewDir = 'game';
    }

    indexAction(){

        if(this.req.isAuthenticated()){
            this.viewVars.title = 'index';
            this.render(this.view);
        }
        else{
            this.viewVars.flashMessages.push({type : 'warning', message : 'Vous devez être connecté!'});
            this.res.redirect('/users/login');
        }

    }

}

module.exports = GamesController;



