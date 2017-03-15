const baseController = require('./baseController');

class AdminsController extends baseController{
    constructor(req, res){
        super(req, res);
        this.viewVars.defaultLayout   = 'adminLayout';
        this.viewDir = 'admin';
    }

    indexAction(){

        this.viewVars.title = 'index';
        this.render(this.view);
    }

}

module.exports = AdminsController;


