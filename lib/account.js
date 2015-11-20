var _ = require('lodash');

var model = require('./model');

var Account = model.create(function() {

});

// Create a request url
Account.prototype.url = function() {
    return _.compact(
        ['/account'].concat(_.toArray(arguments))
    ).join('/');
};

// Get details about the account
Account.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

module.exports = Account;
