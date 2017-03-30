const baseModel = require('./baseModel');
const passportLocalMongoose = require('passport-local-mongoose');

/**
 * User model
 */
class Users extends baseModel{

    /**
     * Call parent and define schema, plus enable passeport plugin
     */
    constructor(){
        super('users');

        let Schema = this.db.Schema;
        this.schema = new Schema({
            username    : String,
            email       : String,
            status      : { type: String, default: 'Hors ligne'},
            password    : String,
            socketId    : String,
            games       : [{ type: Schema.Types.ObjectId, ref: 'games' }],
            created     : { type: Date, default: Date.now }
        });

        this.schema.plugin(passportLocalMongoose, {hashField : 'password'});

    }

    /**
     * Find user's played games
     * @param user
     */
    findGames(user){
        // Todo get all played user games
    }
}


module.exports = new Users();