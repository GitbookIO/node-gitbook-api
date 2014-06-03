var request = require('request');
var _ = require('lodash');
var events = require('events');
var util = require('util');
var Q = require('q');

var Resource = function(Method, Model, options) {
    options = _.defaults({}, options || {}, {
        'mode': 'get',
        'select': null,
        'argsContext': null
    });

    return function() {
        var that = this;
        var method = Method;

        var args = Array.prototype.slice.call(arguments, 0);
        var methodArgs = (method.split("?").length - 1); // n args for this method

        // Bind args in url
        var bindArgs = args.slice(0, methodArgs);
        _.each(bindArgs, function(arg) {
            method = method.replace("?", args);
        });

        formArgs = args.slice(methodArgs, 1)[0] || {};

        // Use args context: {a:} -> {b: {a:} }
        if (options.argsContext) {
            var oldArgs = formArgs;
            formArgs = {};
            formArgs[options.argsContext] = oldArgs;
        }

        return this.request(options.mode, method, formArgs).then(function(data) {
            // Use selector {a: {b:} } -> {b:}
            if (options.select) {
                data = data[options.select];
            }

            if (!data) {
                return null;
            }

            if (!Model) {
                return data;
            }

            if (!_.isArray(data)) {
                return new Model(that, data);
            }
            return _.map(data, function(d) {
                return new Model(that, d);
            }, this);
        });
    };
};

module.exports = Resource;
