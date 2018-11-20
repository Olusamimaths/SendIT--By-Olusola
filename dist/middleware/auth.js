'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkAuth = function checkAuth(req, res, next) {
  try {
    var token = req.headers.authorization.split(' ')[1];

    var decoded = _jsonwebtoken2.default.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Auth Failed'
    });
  }
};

exports.default = checkAuth;