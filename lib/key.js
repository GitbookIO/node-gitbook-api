var _ = require('lodash');

var model = require('./model');
var pagination = require('./pagination');

var Key = model.create(function(book, id) {
    this.book = book;
    this.username = username;
});

// Create a request url
Key.prototype.url = function() {
    return this.book.repo.url('keys/'+this.id);
};

// Get details about the author
Key.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

// Remove the key
Key.prototype.destroy = function() {
    return this.client.del(this.url());
};

// Edit the key
Key.prototype.edit = function(params) {
    return this.client.patch(this.url(), params)
        .get('body');
};

module.exports = Key;
