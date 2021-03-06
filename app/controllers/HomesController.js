'use strict';

const baseController = require('./baseController');

class HomesController extends baseController{
    constructor(req, res, next){
        super(req, res, next);
    }

    indexAction(){

        let userModel = this.getModel('users');

        userModel.find({}, (err, users) => {
            if (err) {
                throw err;
            }
            this.viewVars.users = users;
            this.viewVars.pageTitle = 'index';
            this.render(this.view);
        },null, {sort : {total_score : -1}});


    }

    contactAction(){
        this.viewVars.pageTitle = 'contact';
        this.viewVars.formTitle = 'Contact';

        if(this.req.method ==='POST'){
            let data = this.req.body;
            data.title = 'Contact';
            data.target = this.req.app.locals.adminEmail;

            this.sendMailView('email/contact', data, (err, response) => {

                if(err){
                    throw err;
                }

                this.viewVars.flashMessages.push({
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
        this.viewVars.pageTitle = 'a propos';
        this.render('static/about');
    }
}

module.exports = HomesController;



