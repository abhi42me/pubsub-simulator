var _ = require('lodash');
var pubsubCore = require('../core/pubsub-core');
var InvalidInputException = require('../errors/error-types').InvalidInputException;

var _get = function (req, res, next) {
    try {
        var name = req.params.exchange_name;
        return res.status(200).json(pubsubCore.getExchange(name));
    } catch (err) {
        next(err);
    }
};

var _create = function (req, res, next) {
    try {
        var data = req.body;
        var name = _.get(data, 'name');
        if (!name) {
            throw new InvalidInputException("Name cannot be null for creating an exchange");
        }
        name = _.kebabCase(name);
        return res.status(200).json(pubsubCore.addExchange(name));
    } catch (err) {
        next(err);
    }
};

var _remove = function (req, res, next) {
    try {
        var name = req.params.exchange_name;
        pubsubCore.removeExchange(name);
        return res.status(200).json();
    } catch (err) {
        next(err);
    }
};

var _publishMessage = function (req, res, next) {
    try {
        var data = req.body;
        var exchange_name = req.params.exchange_name;
        var routing_key = _.get(data, "routing_key");
        var event_data = _.get(data, "data");
        if (!exchange_name || !routing_key) {
            throw new InvalidInputException("Exchange name and routing is mandatory for publishing a message");
        }

        routing_key = _.kebabCase(routing_key);
        pubsubCore.publishMessage(exchange_name, routing_key, event_data);
        return res.status(200).json();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    get: _get,
    create: _create,
    remove: _remove,
    publishMessage: _publishMessage
};
