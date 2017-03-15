const localConf     = module.require('../conf');
const mongoose      = module.require('mongoose');
class baseModel{

    constructor(document){
        this.mongoose   = mongoose;
        this.document   = document;
        this.schema     = mongoose.Schema;
        this.model      = require('../models/' + document.toUpperCase());
        this.bddUrl     = localConf.bdd.url();
    }

    connect(bddUrl){
       return this.mongoose.createConnection(bddUrl || this.bddUrl);
    }

}

module.exports = baseModel;