const baseController = require('./baseController');

class usersController extends baseController{

    constructor(req, res){
        super(req, res);
        this.viewDir = 'user/';
        this.viewVars = {};
    }

    loginAction(){
        if(this.req.method ==='POST'){
            let logins = this.req.body;
            if(logins.username && logins.password){

                let username = logins.username;
                let password = logins.password;

                let userModel = this.getModel('users');

            }
            // No username or login
            else{
                this.req.flash('danger', '-- Formulaire invalide --');
                this.render(this.view , this.viewVars);
            }
        }
        // Not post
        else{
            let userModel = this.getModel('users');

            console.log(userModel.find({}));

            this.render(this.view , this.viewVars);
        }

    }

}


module.exports = usersController;