'use strict';
const baseController = require('./baseController');

class AdminsController extends baseController{
    constructor(req, res){
        super(req, res);
        this.viewVars.defaultLayout   = 'adminLayout';
        this.viewDir = 'admin';
    }

    indexAction(){

        this.viewVars.pageTitle = 'index';
        this.render(this.view);
    }

}

module.exports = AdminsController;



