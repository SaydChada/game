const baseController = require('./baseController');

class GamesController extends baseController{
    constructor(req, res, next){
        super(req, res, next);
        this.viewDir = 'game';
    }

    indexAction(){

        this.viewVars.title = 'index';
        this.render(this.view);
    }

}

module.exports = GamesController;



