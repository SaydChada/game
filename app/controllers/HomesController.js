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
        this.viewVars.title = 'contact';
        this.viewVars.formTitle = 'Contact';
        this.render('static/contact');
    }

    aboutAction(){
        this.viewVars.title = 'a propos';
        this.render('static/about');
    }
}

module.exports = HomesController;



