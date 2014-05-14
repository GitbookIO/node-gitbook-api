var events = require('events');
var _ = require('lodash');
var util = require('util');

var Model = function(client, data) {
    events.EventEmitter.call(this);

    // Client
    this.client = client;

    // Properties
    _.extend(this, data || {});
};
util.inherits(Model, events.EventEmitter);

module.exports = Model;