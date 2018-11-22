'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _getAOrder = require('../controller/parcels/getAOrder');

var _getAOrder2 = _interopRequireDefault(_getAOrder);

var _getAllOrders = require('../controller/parcels/getAllOrders');

var _getAllOrders2 = _interopRequireDefault(_getAllOrders);

var _createParcel = require('../controller/parcels/createParcel');

var _createParcel2 = _interopRequireDefault(_createParcel);

var _auth = require('../middleware/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// the forwarded routes from app.js is appended to become /api/v1/order
router.post('/parcels', _auth.checkAuth, _createParcel2.default);

// Getting all orders 
router.get('/parcels', _auth.checkAuth, _getAllOrders2.default);

// Get specific parcel order
router.get('/parcels/:parcelId', _auth.checkAuth, _getAOrder2.default);

exports.default = router;