const baseModel = require('./baseModel');

class Users extends baseModel{

    constructor(){
        super('users');

        this.schema = new Schema({
            username: String,
            email: String,
            password: String,
            created: { type: Date, default: Date.now }
        });

        this.schema.plugin(autoIncrement.plugin, 'users');

    }

    getModel(){
        this.connect();
        return  this.connection.model(this.document, this.schema);
    }



}


module.exports = new Users();