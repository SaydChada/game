const baseController = require('./baseController');

class GamesController extends baseController{
    constructor(req, res){
        super(req, res);
        this.viewDir = 'game';
    }

    indexAction(){

        this.viewVars.title = 'index';
        this.render(this.view);
    }

}

module.exports = GamesController;



