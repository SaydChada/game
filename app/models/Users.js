const baseModel = require('./baseModel');

class Users extends baseModel{

    constructor(){
        super('users');

        let Schema = this.db.Schema;
        this.schema = new Schema({
            username: String,
            email: String,
            password: String,
            created: { type: Date, default: Date.now }
        });

    }
}


module.exports = new Users();