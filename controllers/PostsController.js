const baseController = require('./baseController');


class PostController extends baseController{

    constructor(req, res){
        super(req, res);
    }

    all(){
        // Des choses, des tests sur l'id par exemple
    }
    get(){
        let data = {id:this.params.id};

        this.render(data, this.params.render, this.params.action);
    }
    post(){

    }
    put(){

    }
    remove(){

    }



}


module.exports = postController;