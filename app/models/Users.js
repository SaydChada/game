const baseModel = require('./baseModel');
const passportLocalMongoose = require('passport-local-mongoose');
class Users extends baseModel{

    constructor(){
        super('users');

        let Schema = this.db.Schema;
        this.schema = new Schema({
            username    : String,
            email       : String,
            password    : String,
            created     : { type: Date, default: Date.now }
        });

        this.schema.plugin(passportLocalMongoose, {hashField : 'password'});

    }
}


module.exports = new Users();