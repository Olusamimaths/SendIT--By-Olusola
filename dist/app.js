'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _order = require('./controllers/order');

var _order2 = _interopRequireDefault(_order);

var _signup = require('./controllers/signup');

var _signup2 = _interopRequireDefault(_signup);

var _login = require('./controllers/login');

var _login2 = _interopRequireDefault(_login);

var _parcel = require('./controllers/parcel');

var _parcel2 = _interopRequireDefault(_parcel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// setting the bodyParser
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.use('/api/v1/', _order2.default); // url starting with /api/v1 are forwarded to router parcelRoutes
app.use('/api/v1/', _parcel2.default);
app.use('/api/v1/', _signup2.default);
app.use('/api/v1/', _login2.default);

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