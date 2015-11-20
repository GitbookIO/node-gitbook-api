var _ = require('lodash');

var model = require('./model');
var pagination = require('./pagination');

var Author = model.create(function(username) {
    this.username = username;
});

// Create a request url
Author.prototype.url = function() {
    return _.compact(
        ['/author/'+this.username].concat(_.toArray(arguments))
    ).join('/');
};

// Get details about the author
Author.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

module.exports = Author;
