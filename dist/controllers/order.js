'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth = require('../middleware/auth');

var _auth2 = _interopRequireDefault(_auth);

var _db = require('../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// the forwarded routes from app.js is appended to become /api/v1/order
router.post('/parcels', _auth2.default, function (req, res, next) {
  var weight = req.body.weight;

  var weightMetric = weight + ' kg';
  var from = req.body.from;
  var to = req.body.to;
  var currentLocation = req.body.currentLocation;
  var password = req.body.password;

  var status = 'Delivered';
  var sentOn = 'NOW()';
  var deliveredOn = 'NOW()';
  var userData = req.userData;

  // define the query

  var query = 'INSERT INTO parcel(placedby, weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
  var values = [12, weight, weightMetric, sentOn, deliveredOn, status, from, to, currentLocation];

  _db2.default.query(query, values).then(function (result) {
    _db2.default.query('SELECT id FROM parcel').then(function (r) {
      // getting the index of the last item in the row
      var lastRow = r.rows.length - 1;
      res.status(200).send({
        status: 200,
        data: [{
          id: r.rows[lastRow].id, // get the id of the inserted order
          message: 'order created',
          userData: userData
        }]
      });
    }).catch(function (e) {
      return res.status(404).json({ error: e });
    });
  }).catch(function (error) {
    return res.send(error.stack);
  });
});

// Getting all orders 
router.get('/parcels', _auth2.default, function (req, res, next) {
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
  }).catch(function (e) {
    return res.status(409).json({
      status: 409,
      error: 'Could not fetch orders'
    });
  });
});

// Get specific parcel order
router.get('/parcels/:parcelId', _auth2.default, function (req, res, next) {
  var query = 'SELECT * FROM parcel where id = $1';
  var value = [req.params.parcelId];
  // run the query  
  _db2.default.query(query, value).then(function (result) {
    if (result.rows[0]) {
      res.status(200).json({
        status: 200,
        data: [{
          weight: result.rows[0].weight,
          weightMetric: result.rows[0].weightMetric,
          sentOn: result.rows[0].senton,
          deliveredOn: result.rows[0].deliveredon,
          status: result.rows[0].status,
          from: result.rows[0]._from,
          to: result.rows[0]._to,
          currentLocation: result.rows[0].currentlocation
        }]
      });
    } else {
      res.status(404).json({
        message: 'No such parcel order exist'
      });
    }
  }).catch(function (e) {
    return res.send(409).json({ error: e });
  });
});

exports.default = router;