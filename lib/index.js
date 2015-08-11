var _ = require('lodash');
var Q = require('q');
var request = require('request');
var url = require('url');
var base64 = require('js-base64').Base64;

function GitBook(opts) {
    if (!(this instanceof GitBook)) return new GitBook(opts);

    this.options = _.defaults(opts || {}, {
        host: "https://www.gitbook.com",
        username: null,
        token: null
    });

    _.bindAll(this);
}

// Execute an api request
GitBook.prototype.request = function(httpMethod, method, args) {
    var that = this;
    var d = Q.defer();

    var requestUrl = url.resolve(this.options.host, '/api/'+method);
    var opts = {
        method: httpMethod,
        url: requestUrl,
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json;charset=UTF-8',
            'User-Agent': 'node-gitbook-api'
        }
    };

    if (this.options.username) {
        opts.headers['Authorization'] = 'Basic ' + base64.encode(this.options.username + ':' + this.options.token);
    }

    if (httpMethod == 'get') opts.qs = args || {};
    else opts.form = args || {};

    request(opts, function(err, response, body) {
        var statusType = Math.floor(response.statusCode/100)+'XX';

        if (!err &&  statusType == '2XX') return d.resolve(body);

        if (!err) {
            if (body && body.error) {
                err = new Error(body.error);
            } else {
                err = new Error(response.statusCode+': '+response.statusMessage);
            }
        }
        err.statusCode = response.statusCode;
        err.response = response;
        err.body = body;

        d.reject(err);
    });

    return d.promise;
};

GitBook.prototype.get = _.partial(GitBook.prototype.request, 'get');
GitBook.prototype.post = _.partial(GitBook.prototype.request, 'post');
GitBook.prototype.delete = _.partial(GitBook.prototype.request, 'delete');

// Get account informations
GitBook.prototype.account = function(bookId, opts) {
    return this.get('account', opts);
};

// List books
GitBook.prototype.books = function(selector, opts) {
    if (_.isObject(selector)) {
        opts = selector;
        selector = "";
    }
    return this.get('books'+(selector? '/'+selector : ""), opts);
};

// Get a specific book
GitBook.prototype.book = function(bookId, opts) {
    return this.get('book/'+bookId, opts);
};

// Get a specific author
GitBook.prototype.author = function(authorId, opts) {
    return this.get('author/'+authorId, opts);
};

module.exports = GitBook;
