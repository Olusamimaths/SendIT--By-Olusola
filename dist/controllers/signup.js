'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _db = require('../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/auth/signup', function (req, res, next) {
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
      return res.status(409).json({
        status: 409,
        message: 'Mail exists'
      });
    }
  });

  // hash the password
  _bcrypt2.default.hash(password, 10, function (err, hash) {
    if (err) {
      res.status(500).json({
        status: 500,
        error: err
      });
    } else if (typeof username !== 'undefined' && typeof firstname !== 'undefined' && typeof lastname !== 'undefined' && typeof othernames !== 'undefined' && typeof email !== 'undefined' && typeof password !== 'undefined') {
      // no field is missing
      var query = 'INSERT INTO users(username, firstname, lastname, othernames, email, isadmin, registered, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
      var values = [username, firstname, lastname, othernames, email, isadmin, registered, hash];
      // run the query
      _db2.default.query(query, values).then(function (result) {
        // select the details
        _db2.default.query('SELECT id, username, firstname, lastname, othernames, email, isadmin, registered, password FROM users').then(function (r) {
          // create the token
          var token = _jsonwebtoken2.default.sign({
            id: r.rows[0].id,
            email: email,
            username: username
          }, process.env.JWT_KEY, {
            expiresIn: '1h'
          });

          // send the response
          res.status(200).json({
            status: 200,
            data: [{
              token: token,
              id: r.rows[0].id,
              firstname: r.rows[0].firstname,
              lastname: r.rows[0].lastname,
              othernames: r.rows[0].othernames,
              email: r.rows[0].email,
              username: r.rows[0].username,
              registered: r.rows[0].registered,
              isAdmin: r.rows[0].isadmin
            }]
          });
        }).catch(function (e) {
          return res.status(409).json({
            status: 409,
            error: 'User doesn\'t exists'
          });
        });
      }).catch(function (error) {
        return res.send(error.stack);
      });
    } else {
      // one or more fields are missing
      res.status(500).json({
        status: 500,
        message: 'All fields are requiered'
      });
    }
  });
});

exports.default = router;