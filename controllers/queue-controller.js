var _ = require('lodash');
var pubsubCore = require('../core/pubsub-core');
var InvalidInputException = require('../errors/error-types').InvalidInputException;

//var _get = function (req, res, next) {
//    try {
//        var exchange_name = req.params.exchange_name;
//        var queue_name = req.params.exchange_name;
//        return res.status(200).json(pubsubCore.getExchange(name));
//    } catch (err) {
//        next(err);
//    }
//};

var _create = function (req, res, next) {
    try {
        var data = req.body;
        var exchange_name = req.params.exchange_name;
        var queue_name = _.get(data, 'name');
        if (!exchange_name || !queue_name) {
            throw new InvalidInputException("Exchange name and queue name cannot be null for creating a queue");
        }
        queue_name = _.kebabCase(queue_name);
        pubsubCore.addQueue(exchange_name, queue_name)
        return res.status(200).json();
    } catch (err) {
        next(err);
    }
};

var _remove = function (req, res, next) {
    try {
        var data = req.body;
        var exchange_name = req.params.exchange_name;
        var queue_name = req.params.queue_name;
        if (!exchange_name || !queue_name) {
            throw new InvalidInputException("Exchange name and queue name cannot be null for deleting a queue");
        }
        pubsubCore.removeQueue(exchange_name, queue_name)
        return res.status(200).json();
    } catch (err) {
        next(err);
    }
};

var _addMapping = function (req, res, next) {
    try {
        var data = req.body;
        var exchange_name = req.params.exchange_name;
        var queue_name = req.params.queue_name;
        var mapping = _.get(data, 'name');
        if (!exchange_name || !queue_name || !mapping) {
            throw new InvalidInputException("Exchange name, queue name and routing key cannot be null for adding a mapping");
        }

        mapping = _.kebabCase(mapping);
        pubsubCore.addMapping(exchange_name, queue_name, mapping);
        return res.status(200).json();
    } catch (err) {
        next(err);
    }
};

var _removeMapping = function (req, res, next) {
    try {
        var exchange_name = req.params.exchange_name;
        var queue_name = req.params.queue_name;
        var mapping = req.params.routing_key;

        if (!exchange_name || !queue_name) {
            throw new InvalidInputException("Exchange name, queue name and routing key cannot be null for deleting a mapping");
        }

        mapping = _.kebabCase(mapping);
        pubsubCore.removeMapping(exchange_name, queue_name, mapping);
        return res.status(200).json();
    } catch (err) {
        next(err);
    }
};

var _fetchMessage = function (req, res, next) {
    try {

        var exchange_name = req.params.exchange_name;
        var queue_name = req.params.queue_name;

        if (!exchange_name || !queue_name) {
            throw new InvalidInputException("Exchange name, queue name cannot be null for consuming a message");
        }

        var messages = pubsubCore.getMessages(exchange_name, queue_name, 1);
        if (messages) {
            return res.status(200).json(messages);
        } else {
            return res.status(200).json();
        }
    } catch (err) {
        next(err);
    }
};

var _acknowledgeMessage = function (req, res, next) {
    try {
        var exchange_name = req.params.exchange_name;
        var queue_name = req.params.queue_name;
        var data = req.body;

        if (!exchange_name || !queue_name) {
            throw new InvalidInputException("Exchange name, queue name cannot be null for consuming a message");
        }

        var count = _.get(data, "count", 1);
        pubsubCore.acknowledgeMessages(exchange_name, queue_name, count);
        return res.status(200).json();

    } catch (err) {
        next(err);
    }
};


module.exports = {
    create: _create,
    remove: _remove,
    addMapping: _addMapping,
    removeMapping: _removeMapping,
    fetchMessage: _fetchMessage,
    acknowledgeMessage: _acknowledgeMessage
};


