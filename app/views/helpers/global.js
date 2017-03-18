let blocks = Object.create(null);

module.exports =  {
    "extends" : function(name, context) {
        let block = blocks[name];
        if (!block) {
            block = blocks[name] = [];
        }

        block.push(context.fn(this));
    },
    "block" : function(name) {
        let val = (blocks[name] || []).join('\n');

        // clear the block
        blocks[name] = [];
        return val;
    },
    "debug" : function(optionalValue) {

        console.log("HBS vars : " );
        console.log("====================");
        console.log(optionalValue);

    },
    'xif' : function (v1, operator, v2, options) {

        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    }
};