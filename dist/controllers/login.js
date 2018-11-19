'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _db = require('../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/login', function (req, res, next) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;


  var query = 'SELECT password FROM users WHERE email = $1';
  var values = [email];
  var hash = '';

  _db2.default.query(query, values, function (err, result) {
    if (result.rows[0]) {
      hash = result.rows[0].password;
    }
    if (err) {
      res.status(409).send({
        message: 'Auth failed'
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
          return res.status(200).json({
            message: 'Auth Successful'
          });
        }
        res.status(401).json({
          message: 'Auth failed'
        });
      });
    }
  });
});

exports.default = router;