'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// getting all parcels
router.get('/parcel', function (req, res, next) {
  res.status(200).json({
    message: 'You requested for the list of parcel'
  });
});

// getting a specific parcel order
router.get('/parcel/:parcelId', function (req, res, next) {
  var id = req.params.parcelId;
  res.status(200).json({
    message: 'You requested for the parcel with the id ' + id
  });
});

exports.default = router;