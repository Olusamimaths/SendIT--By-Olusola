'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// the forwarded routes from app.js is appended to become /api/v1/parcel
router.post('/parcel', function (req, res, next) {
  var parcel = {
    status: 200,
    data: [{
      id: 2,
      weight: req.body.weight,
      weightmetric: req.body.weight,
      from: req.body.from,
      to: req.body.to,
      currentlocation: req.body.location,
      message: 'order created'
    }]
  };
  res.status(201).json({
    message: 'Handling Post requests to /parcel',
    createdParcel: parcel
  });
});

exports.default = router;