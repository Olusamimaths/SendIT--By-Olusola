'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _db = require('../models/db');

var _db2 = _interopRequireDefault(_db);

var _check = require('express-validator/check');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logIn = function logIn(req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;

  //check('email','Email field is required to login').notEmpty();

  (0, _check.check)('email', 'Email is not valid').isEmail();
  //check('password', 'Password field is required to login').notEmpty();

  var errors = (0, _check.validationResult)(req);

  if (errors) {
    return res.status(422).json({
      errors: "Invalid inputs"
    });
  }

  var query = 'SELECT * FROM users WHERE email = $1';
  var values = [email];
  var hash = '';

  _db2.default.query(query, values, function (err, result) {
    if (result.rows[0]) {
      hash = result.rows[0].password;
    }
    if (err) {
      res.status(409).send({
        status: 409,
        error: 'Auth failed'
      });
    } else {
      // verifying the password 
      _bcrypt2.default.compare(password, hash, function (error, compareRes) {
        if (error) {
          return res.status(409).send({
            message: 'Auth failed'
          });
        }
        // if comparision is correct
        if (compareRes) {
          // create the token
          var token = _jsonwebtoken2.default.sign({
            id: result.rows[0].id,
            isadmin: result.rows[0].isadmin,
            email: result.rows[0].email,
            username: result.rows[0].username
          }, process.env.JWT_KEY, {
            expiresIn: '1h'
          });
          // success in login
          return res.status(200).json({
            status: 200,
            message: 'Auth Successful',
            data: [{
              token: token,
              id: result.rows[0].id,
              firstname: result.rows[0].firstname,
              lastname: result.rows[0].lastname,
              othernames: result.rows[0].othernames,
              email: result.rows[0].email,
              username: result.rows[0].username,
              registered: result.rows[0].registered,
              isAdmin: result.rows[0].isadmin
            }]
          });
        }
        res.status(401).json({
          status: 401,
          message: 'User not found'
        });
      });
    }
  });
};

exports.default = logIn;