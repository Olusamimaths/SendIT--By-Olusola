'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAuth = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var userData = '';

var checkAuth = function checkAuth(req, res, next) {
  try {
    var token = req.headers.authorization.split(' ')[1];
    var decoded = _jsonwebtoken2.default.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Authentication Failed'
    });
  }
};

// const userId = userData.id;

exports.checkAuth = checkAuth;