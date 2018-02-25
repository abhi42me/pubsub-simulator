var _ = require('lodash');
var pubsubCore = require('../core/pubsub-core');
var InvalidInputException = require('../errors/error-types').InvalidInputException;


var _get = function (req, res, next) {
    var data = pubsubCore.getDashboardData();
    res.render('dashboard', { title: 'Pubsub Simulator', exchange_data: data });
};

module.exports = {
    get: _get
};