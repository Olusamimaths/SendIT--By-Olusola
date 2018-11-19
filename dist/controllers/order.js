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
    res.status(200).send({
      message: 'Saved'
    });
  }).catch(function (error) {
    return res.send(error.stack);
  });
});

// Getting all orders 
router.get('/parcels', function (req, res, next) {
  var query = 'SELECT weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation FROM parcel';
  _db2.default.query(query).then(function (result) {
    var arr = [];
    result.rows.forEach(function (i) {
      arr.push({
        status: 200,
        data: [{
          weight: i.weight,
          weightMetric: i.weightMetric,
          sentOn: i.senton,
          deliveredOn: i.deliveredon,
          status: i.status,
          from: i._from,
          to: i._to,
          currentLocation: i.currentlocation
        }]
      });
    });
    res.status(200).json({
      parcelOrders: arr
    });

    // for (let i = 0; i < result.rows.length; i++) {
    //   res.send({
    //     status: result.rows[i].status,
    //   });
    // } 
  }).catch(function (e) {
    return res.status(409).json({
      message: e.stack
    });
  });
});

// Get specific parcel order
router.get('/parcels/:parcelId', function (req, res, next) {
  var query = 'SELECT * FROM parcel where id = $1';
  var value = [req.params.parcelId];

  _db2.default.query(query, [value], function (err, result) {
    return res.status(409).send({
      orders: result.rows
    });
  });
});

exports.default = router;