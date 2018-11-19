'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _db = require('../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// the forwarded routes from app.js is appended to become /api/v1/order
router.post('/order', function (req, res, next) {
  var weight = req.body.weight;

  var weightMetric = weight + ' kg';
  var from = req.body.from;
  var to = req.body.to;
  var currentLocation = req.body.currentLocation;
  var password = req.body.password;

  var status = 'Delivered';
  var sentOn = 'NOW()';
  var deliveredOn = 'NOW()';
  var placedBy = 12; // this will be gotten from the users table

  var query = 'INSERT INTO parcel(placedby, weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';

  var values = [placedBy, weight, weightMetric, sentOn, deliveredOn, status, from, to, currentLocation];

  _db2.default.query(query, values).then(function (result) {
    res.send({
      message: 'Saved'
    });
  }).catch(function (error) {
    return res.send(error.stack);
  });
});

// Getting orders 
router.get('/order', function (req, res, next) {
  var query = 'SELECT * FROM parcel';

  _db2.default.query(query, [], function (err, result) {
    return res.status(409).send({
      orders: result.rows
    });
  });
});

exports.default = router;