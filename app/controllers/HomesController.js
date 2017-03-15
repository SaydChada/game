const baseController = require('./baseController');

class HomesController extends baseController{
    constructor(req, res){
        super(req, res);
    }

    indexAction(){

        this.viewVars.title = 'index';
        this.render(this.view);
    }

    contactAction(){
        this.render('static/contact');
    }
}

module.exports = HomesController;



