const baseController = require('./baseController');

class HomeController extends baseController{
    constructor(req, res){
        super(req, res);
        this.viewVars = {};
    }

    indexAction(){

        this.render(this.view, {});
    }
}

module.exports = HomeController;



