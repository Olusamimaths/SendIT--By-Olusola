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
  var weight = req.body.weight;

  var weightMetric = weight * 100;
  var placeBy = 12;
  var senton = 'NOW()';

  var values = [placeBy, weight, weightMetric, senton];

  _db2.default.query(query, values).then(function (result) {
    res.send({
      message: 'Saved'
    });
  }).catch(function (error) {
    return res.send(error.stack);
  });
});

exports.default = router;