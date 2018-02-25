var bodyParser = require('body-parser');
var boolParser = require('express-query-boolean');

exports.jsonParser = bodyParser.json({limit: '5mb'});
exports.urlEncodedParser = bodyParser.urlencoded({limit: '5mb', extended: false});
exports.booleanParser = boolParser();