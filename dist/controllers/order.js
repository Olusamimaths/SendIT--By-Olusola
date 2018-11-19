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
  var query = 'INSERT INTO parcel(placedBy, weight, weightMetric, senton) VALUES ($1, $2, $3, $4)';
  var values = [1000, 10, 12.23, '2018-11-8'];
  _db2.default.query(query, values).then(function (result) {
    res.send(result.rows[0]);
  }).catch(function (error) {
    return res.send(error.stack);
  });

  // const parcel = {
  //   status: 200,
  //   data: [
  //     { 
  //       id: 2,
  //       weight: req.body.weight,
  //       weightmetric: req.body.weight,
  //       from: req.body.from,
  //       to: req.body.to,
  //       currentlocation: req.body.location,
  //       message: 'order created',
  //     },
  //   ],
  // };
  // res.status(201).json({
  //   message: 'Handling Post requests to /order',
  //   createdParcel: parcel,
  // });
});

exports.default = router;