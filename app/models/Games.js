const baseModel = require('./baseModel');

/**
 * Games model
 */
class Games extends baseModel{

    /**
     * Call parent and define schema
     */
    constructor(){
        super('games');

        let Schema = this.db.Schema;
        this.schema = new Schema({
            room_name   : String,
            email       : String,
            duration    : String,
            p1          :  [{ type: Schema.Types.ObjectId, ref: 'users' }],
            p2          :  [{ type: Schema.Types.ObjectId, ref: 'users' }],
            p1_score    : Number,
            p2_score    : Number,
            created     : { type: Date, default: Date.now }
        });

    }

    getLeaderBoard(){
        // Todo get users & score by ranking
    }
}


module.exports = new Games();