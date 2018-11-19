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

  // defining the query
  _bcrypt2.default.hash(password, 10, function (err, hash) {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      var query = 'INSERT INTO users(username, firstname, lastname, othernames, email, isadmin, registered, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
      var values = [username, firstname, lastname, othernames, email, isadmin, registered, hash];
      _db2.default.query(query, values).then(function (result) {
        res.status(201).send({
          message: 'User Created'
        });
      }).catch(function (error) {
        return res.send(error.stack);
      });
    }
  });
});

exports.default = router;