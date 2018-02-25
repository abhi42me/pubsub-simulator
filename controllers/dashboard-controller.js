var _ = require('lodash');
var pubsubCore = require('../core/pubsub-core');
var InvalidInputException = require('../errors/error-types').InvalidInputException;


var _render = function (req, res, next) {
    var data = pubsubCore.getDashboardData();
    res.render('dashboard', {title: 'Pubsub Simulator', exchange_data: data});
};


var _get = function (req, res, next) {
    try {
        var data = pubsubCore.getDashboardData();
        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};


module.exports = {
    get: _get,
    render: _render
};