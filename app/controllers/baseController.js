class baseController{
    constructor(req, res){
        this.req = req;
        this.res = res;
        this.viewDir = '';
        this.params = this.req.params;
        this.models = {};
    }

    beforeRender(view){

        if(view){
            this.params.action = view;
        }

        // LOG

        console.log('viewDir : ' , this.viewDir);
        console.log('action : ' , this.params.action);
        this.view = this.viewDir + this.params.action;

        return this.view;
    }

    getModel(modelName){

        let model = '../models/' + modelName;

        if(!this.models[modelName]){
            this.models[modelName] = require(model);
        }

        return this.models[modelName];
    }

    render(view, data, render){

        this.beforeRender(view, data, render);

        switch(render){
            case 'json' :
                this.res.json(data);
                break;
            default :
                this.res.render(this.view , data);
                break;
        }
    }

    actionExists(name){
        return name in this && typeof this[name] === 'function';
    }

    callAction(name){
        name = name + 'Action';
        if(this.actionExists(name)){
            this[name]();
            return true;
        }else{
            return false;
        }
    }
}

module.exports = baseController;