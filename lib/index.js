var _ = require('lodash');
var Q = require('q');
var axios = require('axios');
var url = require('url');


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
GitBook.prototype.request = function request(httpMethod, method, args) {
    var that = this;
    var opts = {
        method: httpMethod,
        url: url.resolve(this.options.host, '/api/'+method),
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json;charset=UTF-8',
            'User-Agent': 'node-gitbook-api'
        }
    };

    if (this.options.username) {
        opts.headers['Authorization'] = 'Basic ' + base64.encode(this.options.username + ':' + this.options.token);
    }

    if (httpMethod == 'get') opts.params = args;
    else opts.data = args;

    return Q(axios(opts))
    .get('data')
    .fail(function(response) {
        if (response instanceof Error) throw response;

        var e = new Error(response.data.message || "Error "+response.status+": "+response.data);
        e.statusCode = response.status;

        throw e;
    });
};

GitBook.prototype.get = _.partial(GitBook.prototype.request, 'get');
GitBook.prototype.post = _.partial(GitBook.prototype.request, 'post');
GitBook.prototype.delete = _.partial(GitBook.prototype.request, 'delete');


// List books
GitBook.prototype.books = function(selector, opts) {
    if (_.isObject(selector)) {
        opts = selector;
        selector = "";
    }
    return this.get('books'+(selector? '/'+selector : ""), opts);
}

module.exports = GitBook;
