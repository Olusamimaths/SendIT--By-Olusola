'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _admin_change_status = require('../controller/admin/admin_change_status');

var _admin_change_status2 = _interopRequireDefault(_admin_change_status);

var _admin_change_location = require('../controller/admin/admin_change_location');

var _admin_change_location2 = _interopRequireDefault(_admin_change_location);

var _auth = require('../middleware/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use((0, _cors2.default)());
router.options('*', (0, _cors2.default)());

// changing the status of a parcel delivery order
router.patch('/parcels/:parcelId/status', _auth.checkAuth, _admin_change_status2.default); // end of route

// changing the current location of a parcel delivery order
router.patch('/parcels/:parcelId/currentlocation', _auth.checkAuth, _admin_change_location2.default); // end of route

exports.default = router;