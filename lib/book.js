var _ = require('lodash');

var model = require('./model');
var pagination = require('./pagination');

var Book = model.create(function(bookId) {
    this.id = bookId;
});

// Create a request url
Book.prototype.url = function() {
    return _.compact(
        ['/book/'+this.id].concat(_.toArray(arguments))
    ).join('/');
};

// Get details about the book
Book.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

// Return list of access keys
Book.prototype.keys = pagination(function() {
    return {
        url: this.url('keys')
    };
});

module.exports = Book;
