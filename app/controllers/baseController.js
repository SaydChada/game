/**
 * base class for controllers
 */
const path = require('path');
class baseController{

    /**
     *
     * @param req : Object | HttpRequest
     * @param res : Object | HttpResponse
     */
    constructor(req, res){
        this.req = req;
        this.requireAuth = false;
        this.res = res;
        this.passport = require('passport');
        this.viewDir = '';
        this.params = this.req.params;
        this.models = {};
        this.viewVars = {url : req.url};
    }

    /**
     * Do things before render
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

    /**
     * get model based on model name in lowercase
     * @param modelName
     * @returns {*}
     */
    getModel(modelName){

        modelName = baseController.toModelName(modelName);

        if(!this.models[modelName]){
            let modelPath = path.join('..','models', modelName);
            let model = require(modelPath);
            this.models[modelName] = model.getMongooseModel();
        }

        return this.models[modelName];
    }

    /**
     * Capitalize modelname
     * @param model
     * @returns {string}
     */
    static toModelName(model){
        return model.charAt(0).toUpperCase() + model.slice(1);
    }

    /**
     * Call self::beforeRender then render view
     * @param view : string | template of the view to render
     * @param data
     * @param render
     */
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

    /**
     * Check if action exist
     * @param name
     * @returns {boolean}
     */
    actionExists(name){
        return name in this && typeof this[name] === 'function';
    }

    /**
     * Check if action exist and call it
     * @param name
     * @returns {boolean}
     */
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