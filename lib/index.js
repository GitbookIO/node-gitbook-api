var request = require('request');
var _ = require('lodash');
var events = require('events');
var util = require('util');
var Q = require('q');

var Account = require('./account');
var Book = require('./book');
var Resource = require('./resource');

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

// Normalize an api error
Client.prototype.normError = function(error, body) {
    if (body && body.error) error = new Error(body.error);
    error = error || new Error(JSON.stringify(body));
    return error;
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
            deferred.reject(that.normError(error, body));
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
