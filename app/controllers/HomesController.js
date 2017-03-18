const baseController = require('./baseController');

class HomesController extends baseController{
    constructor(req, res, next){
        super(req, res, next);
    }

    indexAction(){

        this.viewVars.title = 'index';
        this.render(this.view);
    }

    contactAction(){
        this.viewVars.title = 'contact';
        this.viewVars.formTitle = 'Contact';

        if(this.req.method ==='POST'){
            let data = this.req.body;
            data.title = 'Contact';
            data.target = this.req.app.locals.adminEmail;

            this.sendMailView('email/contact', data, (err, response) => {

                if(err){
                    throw err;
                }
                console.log('email sended');
                this.res.session.flashMessages.push({
                    type: 'success',
                    message: 'Merci, votre message a bien été envoyé'
                });

                this.render('static/contact');
            });
        }else{
            this.render('static/contact');
        }


    }

    aboutAction(){
        this.viewVars.title = 'a propos';
        this.render('static/about');
    }
}

module.exports = HomesController;



