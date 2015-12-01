var _ = require('lodash');
var Q = require('q');
var request = require('request');
var url = require('url');
var urljoin = require('urljoin.js');
var base64 = require('js-base64').Base64;

var model = require('./model');
var pagination = require('./pagination');
var Book = require('./book');
var Author = require('./author');
var Account = require('./account');

var pkg = require('../package.json');

function GitBook(opts) {
    if (!(this instanceof GitBook)) return new GitBook(opts);

    this.options = _.defaults(opts || {}, {
        host: "https://api.gitbook.com/",
        username: null,
        token: null
    });

    _.bindAll(this);
}

// Return an endpoint for a method
GitBook.prototype.methodEndpoint = function(method) {
    return urljoin(this.options.host, method);
};

// Return authorization header
GitBook.prototype.authorizationHeader = function() {
    if (this.options.username) {
        return 'Basic ' + base64.encode(this.options.username + ':' + this.options.token);
    } else {
        return 'token '+this.options.token;
    }
};

// Execute an api request
GitBook.prototype.request = function(httpMethod, method, args, opts) {
    var that = this;
    var d = Q.defer();

    var requestUrl = this.methodEndpoint(method);
    var opts = {
        method: httpMethod,
        url: requestUrl,
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json;charset=UTF-8',
            'User-Agent': 'node-gitbook-api/'+pkg.version
        }
    };

    if (this.options.username) {
        opts.headers['Authorization'] = this.authorizationHeader();
    }

    if (httpMethod == 'get') opts.qs = args || {};
    else opts.form = args || {};

    request(opts, function(err, response, body) {
        var statusCode = response? response.statusCode : 0;
        var statusType = Math.floor(statusCode/100)+'XX';
        var statusMessage = response? response.statusMessage : "No connection";

        if (!err &&  statusType == '2XX') {
            return d.resolve({
                body: body
            });
        }

        if (!err) {
            if (body && body.error) {
                err = new Error(body.error);
            } else {
                err = new Error(statusCode+': '+statusMessage);
            }
        }
        err.statusCode = statusCode;
        err.response = response;
        err.body = body;

        d.reject(err);
    });

    return d.promise;
};

GitBook.prototype.get = _.partial(GitBook.prototype.request, 'get');
GitBook.prototype.post = _.partial(GitBook.prototype.request, 'post');
GitBook.prototype.patch = _.partial(GitBook.prototype.request, 'patch');
GitBook.prototype.delete = _.partial(GitBook.prototype.request, 'delete');


// List books
GitBook.prototype.books = pagination(function(selector) {
    return {
        url: 'books'+(selector? '/'+selector : '')
    };
});

GitBook.prototype.account = model.getter(Account);
GitBook.prototype.book = model.getter(Book);
GitBook.prototype.author = model.getter(Author);

module.exports = GitBook;
