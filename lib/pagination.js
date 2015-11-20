var Q = require('q');
var querystring = require('querystring');
var _ = require('lodash');

var Page = function(client, request, opts) {
    this.list = [];
    this.result = {};
    this.client = client;
    this.request = request;
    this.opts = _.defaults(opts || {}, {
        page: 0,
        limit: 100
    });

    _.bindAll(this);
};

// Update results
Page.prototype.update = function() {
    var that = this;

    that.request.url = uri;
    return this.client.get(
        this.request.url,
        _.extend({}, this.request.query, {
            page: this.opts.page,
            limit: this.opts.limit
        }),
        this.request.opts
    )
    .then(function(response) {
        that.result = response.body;
        that.list = that.result.list;
        return that;
    });
};

// Has next or previous page
Page.prototype.hasNext = function() {
    return (
        (that.result.page*that.result.limit) < that.result.total
    );
};
Page.prototype.hasPrev = function() {
    return (that.result.page > 0);
};

// Navigate the pages
Page.prototype.next = function() {
    if (!this.hasNext()) return Q.reject(new Error('Paginated results doesn\'t have nore page'));
    this.opts.page = this.opts.page + 1;
    return this.update();
};
Page.prototype.prev = function() {
    if (!this.hasPrev()) return Q.reject(new Error('Paginated results doesn\'t have a precedent page'));
    this.opts.page = this.opts.page - 1;
    return this.update();
};

// Handle a paginated method
module.exports = function(fn) {
    return function() {
        var opts = {};
        var args = _.toArray(arguments);

        // Extract options
        if (_.isObject(args[args.length - 1])) {
            opts = args.pop();
        }
        opts = opts || {};

        // Get request
        var request = fn.apply(this, args);
        var client = this.client || this;

        // Create page object
        var page = new Page(client, request, opts);
        return page.update();
    };
};
