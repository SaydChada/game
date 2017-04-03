'use strict';

const baseController = require('./baseController');

class GamesController extends baseController{
    constructor(req, res, next){
        super(req, res, next);
        this.viewDir = 'game';
    }

    indexAction(){

        if(this.req.isAuthenticated()){
            this.viewVars.pageTitle = 'game';
            this.viewVars.helpers['getStatusLabel'] = require(this.helpersDir + 'game/getStatusLabel');

            let userModel = this.getModel('users');
            userModel.getOnlineUsers((err, users) => {
                if (err) {
                    throw err;
                }
                this.viewVars.onlineUsers = users;
                this.render(this.view);
            });
        }
        else{
            this.viewVars.flashMessages.push({type : 'warning', message : 'Vous devez être connecté!'});
            this.res.redirect('/users/login');
        }

    }

}

module.exports = GamesController;



