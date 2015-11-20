var _ = require('lodash');

function createModel(fn) {
    return function(client) {
        var args = _.toArray(arguments).slice(1);
        this.client = client;
        fn.apply(this, args);

        _.bindAll(this);
    };
}

function modelGetter(Cls) {
    return function() {
        var args = _.toArray(arguments);

        var client = this;
        if (client.client) {
            args.unshift(client);
            client = client.client;
        }

        args = [null, client].concat(args);
        return (new (Function.prototype.bind.apply(Cls, args)));
    };
}

module.exports = {
    create: createModel,
    getter: modelGetter
};

