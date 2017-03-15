class baseModel{

    constructor(document){
        this.db         = dbConnection;
        this.document   = document;
    }

    getMongooseModel(){
        if(!this.schema){
            throw new Error('Schema must be defined in children classes');
        }
        return this.db.model(this.document, this.schema);
    }

}

module.exports = baseModel;