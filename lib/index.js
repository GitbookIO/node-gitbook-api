var request = require('request');
var _ = require('lodash');
var events = require('events');
var util = require('util');
var Q = require('q');

var Account = require('./account');
var Book = require('./book');

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

var Client = function(config) {
    events.EventEmitter.call(this);

    this.config = _.defaults({}, config || {}, {
        'host': 'https://www.gitbook.io',
        'auth': null
    });
    this.updateConfig();
};
util.inherits(Client, events.EventEmitter);

// Get a request handler
Client.prototype.updateConfig = function(config) {
    this.config = _.extend(this.config, config || {});

    this.http = request.defaults({
        'auth': this.config.auth,
        'json': true,
        'headers': {
            'User-Agent': 'gitbook-api-node'
        },
        'strictSSL': false,
    });
};

// Do a rest api request
// mode: get, post, delete, ...
// method: api method name
// args: api args
Client.prototype.request = function(mode, method, args) {
    var that = this;
    var deferred = Q.defer();

    this.http[mode.toLowerCase()](this.config.host+"/api/"+method, {
        'form': args
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(body);
        } else {
            that.emit("apierror", error, body);
            if (error.error) error = new Error(error.error);
            deferred.reject(error || body);
        }
    });

    return deferred.promise;
};

// Resources access
Client.prototype.account = Resource("account", Account);
Client.prototype.books = Resource("books", Book, {select: 'list'});
Client.prototype.book = Resource("book/?", Book);

// Login an user
Client.prototype.login = function(username, password) {
    var that = this;

    this.updateConfig({
        auth: {
            username: username,
            password: password
        }
    });

    return this.account()
    .then(function(account) {
        that.config.auth.password = account.token;
        that.updateConfig();
        return account.token;
    });
};

module.exports = Client;
