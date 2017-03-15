/**
 * Base class for models which have to extends this one
 */
class baseModel{

    /**
     *
     * @param document : string | bdd document name
     */
    constructor(document){
        this.db         = dbConnection;
        this.document   = document;
    }

    /**
     * Return mongoose model
     * @returns {*|Aggregate|Model}
     */
    getMongooseModel(){
        if(!this.schema){
            throw new Error('Schema must be defined in children classes');
        }
        return this.db.model(this.document, this.schema);
    }

}

module.exports = baseModel;