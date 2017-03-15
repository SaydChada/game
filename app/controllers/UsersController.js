const baseController = require('./baseController');

class UsersController extends baseController{

    constructor(req, res){
        super(req, res);
        this.viewDir = 'user';
    }

    registerAction(){
        if(this.req.method ==='POST'){
            let logins = this.req.body;
            if(logins.username && logins.password && logins.email){

                let data = {
                    username : logins.username,
                    email : logins.email,
                    password : logins.password
                };


                this.register(data);

            }
            // No username or login
            else{
                this.req.flash('danger', '-- Formulaire invalide --');
                this.render(this.view , this.viewVars);
            }
        }
        // Not post resend view
        else{
            let userModel = this.getModel('users');

            userModel.find( (err, users) => {
                if (err) {
                    throw err;
                }
                this.viewVars.users = users;
                this.viewVars.user = this.req.user;
                this.viewVars.formTitle = 'Inscription';
                this.render(this.view , this.viewVars);
            });

        }

    }

    /**
     * Handle registration
     * @param data
     */
    register(data){
        let userModel = this.getModel('users');
        userModel.register(new userModel(data), data.password, (err, account) => {
            if (err) {
                throw err;
            }

            this.passport.authenticate('local')(this.req, this.res, () => {
                console.log('Account : ',account);
                this.res.redirect('/');
            });
        });
    }

    /**
     * Handle login
     */
    loginAction(){
        this.viewVars.formTitle = 'Connexion';
        if(this.req.method ==='POST'){
            this.passport.authenticate('local')(this.req, this.res, () => {
                this.res.redirect('/');
            });
        }else{
            this.render(this.view, this.viewVars);

        }

    }

    logoutAction(){
            this.req.logout();
            this.res.redirect('/');
    }

}


module.exports = UsersController;