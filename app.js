var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var log = require('./core/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressPath = require('express-path');
var routes = require('./routes');
var swaggerJSDoc = require('swagger-jsdoc');
var swagger = require('swagger-tools');
var _ = require('lodash');
var timeout = require('connect-timeout'); //express v4
var sprintf = require('sprintf-js').sprintf;
var app = express();
var ApplicationException = require('./errors/error-types').ApplicationException;
var NotFoundException = require('./errors/error-types').NotFoundException;
var responseTime = require('response-time');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');
//app.set('config', require('./config'));

app.use(timeout(10 * 60 * 1000));

app.use(function (req, res, next) {
  log.info("Handling %s %s", req.method, req.url);
  req.log = log;
  next();
});



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(require('node-sass-middleware')({
//   src: path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   indentedSyntax: true,
//   sourceMap: true
// }));
app.use(express.static(path.join(__dirname, 'public')));

expressPath(app, routes, {verbose: false});

if (process.env.NODE_ENV !== "production") {
  var swaggerDefinition = {
    info: { // API informations (required)
      title: 'Pubsub Simulator', // Title (required)
      version: '1.0.0', // Version (required)
      description: 'API', // Description (optional)
    },
    host: 'localhost:1702', // Host (optional)
    basePath: '/', // Base path (optional)
  };

  // Options for the swagger docs
  var options = {
    // Import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // Path to the API docs
    apis: ['./routes*.js'],
  };
  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  var swaggerSpec = _.defaultsDeep(swaggerJSDoc(options));
  app.get('/api-docs.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  swagger.initializeMiddleware(swaggerSpec, function (middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());
    app.use(middleware.swaggerUi({apiDocs: '/api-docs.json'}));
  });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  if (!req.path.startsWith("/docs")) {
    var err = new NotFoundException();
    next(err);
  } else {
    next();
  }
});

// error handler
app.use(function (err, req, res, next) {
  if (!err) {
    err = {};
  }

  var generic_log_string = sprintf("API Failed %s %s", req.method, req.url);
  try {
    generic_log_string = sprintf("%s, Data: %j", generic_log_string, req.body);

    var log_string = sprintf("%s , Error: %j", generic_log_string, err);
    if (err instanceof Error && err.stack) {
      log_string = sprintf("%s %s", log_string, err.stack);
    }
    log.error(log_string);

  } catch (error) {
    log.error(generic_log_string);
    log.error("Error occurred while logging error message for API %s %s: ", req.method, req.url, error);
  }

  var response_error = {};
  if (err instanceof Error) {
    response_error.message = err.message;
    if (err instanceof ApplicationException) {
      response_error.code = err.status;
    }

    if (req.app.get('env') == null || req.app.get('env') === 'development' || req.app.get('env') === 'staging') {
      response_error._error_info_for_debugging = {};
      response_error._error_info_for_debugging.name = err.name;
      if (err.stack)
        response_error._error_info_for_debugging.stack = err.stack;
    }
  } else {
    response_error = err;
  }

  res.status(err.status || 500);
  res.json(response_error);
});
module.exports = app;
