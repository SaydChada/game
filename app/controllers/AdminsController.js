const baseController = require('./baseController');

class AdminsController extends baseController{
    constructor(req, res){
        super(req, res);
    }

    indexAction(){

        this.viewVars.title = 'index';
        this.render(this.view);
    }

}

module.exports = AdminsController;



