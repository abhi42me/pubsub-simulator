var Exchange = require('../model').Exchange;
var InvalidInputException = require('../errors/error-types').InvalidInputException;
var NotFoundException = require('../errors/error-types').NotFoundException;

var exchange_map = {};

var _checkForExchangeExistence = function (name) {
    if (!exchange_map[name]) {
        throw new InvalidInputException("Exchange doesn't exist");
    }
};

var _addExchange = function (name) {
    if (!exchange_map[name]) {
        exchange_map[name] = new Exchange(name);
    }
    return exchange_map[name];
};

var _getExchange = function (name) {
    _checkForExchangeExistence(name);
    return exchange_map[name];
};

var _removeExchange = function (name) {
    _checkForExchangeExistence(name);
    delete exchange_map[name];
};

var _addQueue = function (exchange_name, queue_name) {
    _checkForExchangeExistence(name);
    exchange_map[exchange_name].addQueue(queue_name);
};

var _removeQueue = function (exchange_name, queue_name) {
    _checkForExchangeExistence(name);
    exchange_map[exchange_name].removeQueue(queue_name);
};

var _addMapping = function (exchange_name, queue_name, mapping) {
    _checkForExchangeExistence(name);
    exchange_map[exchange_name].addMapping(queue_name, mapping);
};

var _removeMapping = function (exchange_name, queue_name, mapping) {
    _checkForExchangeExistence(name);
    exchange_map[exchange_name].removeMapping(queue_name, mapping);
};

var _addMessage = function (exchange_name, mapping, data) {
    _checkForExchangeExistence(name);
    exchange_map[exchange_name].addMessage(mapping, data);
};

var _getMessages = function (exchange_name, queue_name, count) {
    _checkForExchangeExistence(name);
    return exchange_map[exchange_name].getMessages(queue_name, count);
};

var _acknowledgeMessages = function (exchange_name, queue_name, count) {
    _checkForExchangeExistence(name);
    return exchange_map[exchange_name].removeMessages(queue_name, count);
};

module.exports = {
    addExchange: _addExchange,
    getExchange: _getExchange,
    removeExchange: _removeExchange,
    addQueue: _addQueue,
    removeQueue: _removeQueue,
    addMapping: _addMapping,
    removeMapping: _removeMapping,
    publishMessage: _addMessage,
    getMessages: _getMessages,
    acknowledgeMessages: _acknowledgeMessages
};