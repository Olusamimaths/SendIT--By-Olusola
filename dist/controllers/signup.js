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

router.post('/signup', function (req, res, next) {
  var username = req.body.username;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var othernames = req.body.othernames;
  var email = req.body.email;
  var password = req.body.password;

  var isadmin = false;
  var registered = 'NOW()';

  var text = 'SELECT password FROM users WHERE email = $1';
  var value = [email];

  _db2.default.query(text, value, function (err, result) {
    if (result.rows[0]) {
      return res.status(409).send({
        message: 'Mail exists'
      });
    }
  });

  // defining the query
  _bcrypt2.default.hash(password, 10, function (err, hash) {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else if (typeof username !== 'undefined' && typeof firstname !== 'undefined' && typeof lastname !== 'undefined' && typeof othernames !== 'undefined' && typeof email !== 'undefined' && typeof password !== 'undefined') {
      var query = 'INSERT INTO users(username, firstname, lastname, othernames, email, isadmin, registered, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
      var values = [username, firstname, lastname, othernames, email, isadmin, registered, hash];
      _db2.default.query(query, values).then(function (result) {
        res.status(201).send({
          message: 'User Created'
        });
      }).catch(function (error) {
        return res.send(error.stack);
      });
    } else {
      res.status(500).json({
        message: 'All fields are requiered'
      });
    }
  });
});

exports.default = router;