'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _auth = require('../middleware/auth');

var _getAll = require('../controller/users/getAll');

var _getAll2 = _interopRequireDefault(_getAll);

var _cancelOrder = require('../controller/users/cancelOrder');

var _cancelOrder2 = _interopRequireDefault(_cancelOrder);

var _changeDestination = require('../controller/users/changeDestination');

var _changeDestination2 = _interopRequireDefault(_changeDestination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use((0, _cors2.default)());
router.options('*', (0, _cors2.default)());

// getting all parcel Delivery orders
router.get('/users/:userId/parcels', _auth.checkAuth, _getAll2.default);

// changing the destination of a parcel delivery order
router.patch('/parcels/:parcelId/destination', _auth.checkAuth, _changeDestination2.default); // end of route

// Cancelling a delivery order
router.patch('/parcels/:parcelId/cancel', _auth.checkAuth, _cancelOrder2.default); // end of route

exports.default = router;