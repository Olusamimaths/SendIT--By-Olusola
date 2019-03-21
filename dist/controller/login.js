'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _db = require('../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _joi2.default.object().keys({
  password: _joi2.default.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  email: _joi2.default.string().email({ minDomainAtoms: 2 })
});

var logIn = function logIn(req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;


  var result = _joi2.default.validate({ password: password, email: email }, schema);

  // log the user in
  if (!result.error) {
    var query = 'SELECT * FROM users WHERE email = $1';
    var values = [email];
    var hash = '';
    // run the query
    _db2.default.query(query, values, function (err, result) {
      if (result.rows[0]) {
        hash = result.rows[0].password;
      }

      if (!result.rowCount) {
        return res.status(409).json({
          status: 409,
          error: 'Auth failed'
        });
      }
      // verifying the password 
      _bcrypt2.default.compare(password, hash, function (err, compareRes) {
        if (!compareRes) {
          return res.status(409).json({
            status: 409,
            message: 'Auth failed'
          });
        }
        // if comparision is correct
        if (compareRes) {
          // create the token
          var token = _jsonwebtoken2.default.sign({
            id: result.rows[0].id,
            isAdmin: result.rows[0].isadmin,
            email: result.rows[0].email,
            username: result.rows[0].username
          }, process.env.JWT_KEY, {
            expiresIn: '8000h'
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
      });
    });
  } else {
    res.status(500).send({
      status: 500,
      error: result.error.details[0].message
    });
  }
};

exports.default = logIn;