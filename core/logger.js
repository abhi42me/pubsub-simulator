var winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp':true});

if(!process.env.NODE_ENV)
  winston.level='debug';

module.exports = winston;