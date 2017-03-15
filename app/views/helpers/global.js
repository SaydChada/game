let blocks = Object.create(null);

module.exports =  {
    "extends": function(name, context) {
        let block = blocks[name];
        if (!block) {
            block = blocks[name] = [];
        }

        block.push(context.fn(this));
    },
    "block"  : function(name) {
        let val = (blocks[name] || []).join('\n');

        // clear the block
        blocks[name] = [];
        return val;
    }
};