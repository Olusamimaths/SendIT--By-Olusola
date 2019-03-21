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

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _schema = require('../validator/schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var signUp = function signUp(req, res, next) {
  // get the submitted values
  var _req$body = req.body,
      username = _req$body.username,
      firstname = _req$body.firstname,
      lastname = _req$body.lastname,
      othernames = _req$body.othernames,
      email = _req$body.email,
      password = _req$body.password;

  var isadmin = false;
  var registered = 'NOW()';
  console.log(_schema2.default);
  var result = _joi2.default.validate({
    username: username, firstname: firstname, lastname: lastname, othernames: othernames, email: email, password: password
  }, _schema2.default);

  // validate the email
  if (!result.error) {
    var text = 'SELECT password FROM users WHERE email = $1';
    var value = [email];
    _db2.default.query(text, value, function (err, result) {
      if (result.rows[0]) {
        res.status(409).json({
          status: 409,
          message: 'Mail exists'
        });
      } else {
        // hash the password
        _bcrypt2.default.hash(password, 10, function (err, hash) {
          if (err) {
            res.status(500).json({
              status: 500,
              error: err
            });
          } else if (typeof username !== 'undefined' && typeof firstname !== 'undefined' && typeof lastname !== 'undefined' && typeof othernames !== 'undefined' && typeof password !== 'undefined') {
            // no field is missing
            var query = 'INSERT INTO users(username, firstname, lastname, othernames, email, isadmin, registered, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
            var values = [username, firstname, lastname, othernames, email, isadmin, registered, hash];
            // run the query
            _db2.default.query(query, values).then(function (r) {
              // create the token
              var token = _jsonwebtoken2.default.sign({
                id: r.rows[0].id,
                isadmin: isadmin,
                email: email,
                username: username
              }, process.env.JWT_KEY, {
                expiresIn: '8000h'
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
            }).catch(function (error) {
              return res.send(error.stack);
            });
          } else {
            // one or more fields are missing
            res.status(500).json({
              status: 500,
              error: 'All fields are required'
            });
          }
        }); // end of password hashing
      }
    });
  } else {
    // end of validateEmail
    res.status(500).send({
      status: 500,
      error: 'Invalid email format'
    });
  }
};

exports.default = signUp;