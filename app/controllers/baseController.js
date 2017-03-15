/**
 * base class for controllers
 */
const path = require('path');
class baseController{

    constructor(req, res){
        this.req = req;
        this.res = res;
        this.viewDir = '';
        this.params = this.req.params;
        this.models = {};
    }

    /**
     *
     * @param view
     * @param data
     * @returns {string|*}
     */
    beforeRender(view, data){

        if(view){
            this.params.action = view;
        }

        if(data){
            this.viewVars = Object.assign(this.viewVars, data);
        }

        // LOG
        console.log('[viewDir] : "' , this.viewDir,'", [action] "', this.params.action, '"');
        console.log('[viewVars] : ', this.viewVars );

        this.view = path.join(this.viewDir , this.params.action);

        return this.view;
    }

    getModel(modelName){

        modelName = baseController.toModelName(modelName);

        if(!this.models[modelName]){
            let modelPath = path.join('..','models', modelName);
            let model = require(modelPath);
            this.models[modelName] = model.getMongooseModel();
        }

        return this.models[modelName];
    }

    static toModelName(model){
        return model.charAt(0).toUpperCase() + model.slice(1);
    }

    render(view, data, render){

        this.beforeRender(view, data, render);

        switch(render){
            case 'json' :
                this.res.json(data);
                break;
            default :
                this.res.render(this.view , this.viewVars);
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