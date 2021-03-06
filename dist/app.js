'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _swaggerUiExpress = require('swagger-ui-express');

var _swaggerUiExpress2 = _interopRequireDefault(_swaggerUiExpress);

var _swagger = require('./swagger.json');

var _swagger2 = _interopRequireDefault(_swagger);

var _parcel = require('./routes/parcel');

var _parcel2 = _interopRequireDefault(_parcel);

var _signup = require('./routes/signup');

var _signup2 = _interopRequireDefault(_signup);

var _users = require('./routes/users');

var _users2 = _interopRequireDefault(_users);

var _login = require('./routes/login');

var _login2 = _interopRequireDefault(_login);

var _admin = require('./routes/admin');

var _admin2 = _interopRequireDefault(_admin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var app = (0, _express2.default)();

// setting the bodyParser
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

// set up for swagger
app.use('/api-docs', _swaggerUiExpress2.default.serve, _swaggerUiExpress2.default.setup(_swagger2.default));

app.use('/api/v1/', _parcel2.default); // url starting with /api/v1 are forwarded to router parcelRoutes
app.use('/api/v1/', _signup2.default);
app.use('/api/v1/', _login2.default);
app.use('/api/v1/', _users2.default);
app.use('/api/v1/', _admin2.default);

app.use(function (req, res, next) {
  res.locals.user = req.user;
  console.log('req.user', res.user);
  console.log('res.locals.user', res.locals.user);
  next();
});

// handling errors
app.use(function (req, res, next) {
  var error = new Error('Not found');
  error.status = 404;
  next(error);
});
app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

exports.default = app;