var util = require('util');
var _ = require('lodash');
var Q = require('q');
var Model = require('./model');

var Account = function() {
    Model.apply(this, arguments);

    _.defaults(this, {
        'token': null,
        'username': null
    });
};
util.inherits(Account, Model);

module.exports = Account;
