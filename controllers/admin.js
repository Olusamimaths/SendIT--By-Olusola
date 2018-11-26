'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth = require('../middleware/auth');

var _db = require('../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// changing the status of a parcel delivery order
router.patch('/parcels/:parcelId/status', _auth.checkAuth, function (req, res, next) {
  _db2.default.query('SELECT placedby FROM parcel WHERE id = $1', [req.params.parcelId]).then(function (r) {
    if (_auth.userData.isadmin) {
      var query = 'UPDATE parcel SET status = $1 where id = $2 RETURNING *';
      _db2.default.query(query, [req.body.status, req.params.parcelId]).then(function (result) {
        if (result.rows[0]) {
          res.status(200).json({
            status: 200,
            data: [{
              id: result.rows[0].id,
              status: result.rows[0].status,
              message: 'Parcel status updated'
            }]
          });
        }
      }).catch(function (e) {
        return res.status(404).send({
          status: 404,
          error: 'The parcel delivery you requested cannot be found'
        });
      });
    } else {
      res.status(403).send({
        status: 403,
        error: 'You don\'t have permissions to change the status of this order'
      });
    }
  }).catch(function (e) {
    return res.status(404).send({
      status: 404,
      error: 'The parcel delivery you requested cannot be found'
    });
  });
}); // end of route

// changing the current location of a parcel delivery order
router.patch('/parcels/:parcelId/currentlocation', _auth.checkAuth, function (req, res, next) {
  _db2.default.query('SELECT placedby FROM parcel WHERE id = $1', [req.params.parcelId]).then(function (r) {
    if (_auth.userData.isadmin) {
      var query = 'UPDATE parcel SET currentlocation = $1 where id = $2 RETURNING *';
      _db2.default.query(query, [req.body.currentLocation, req.params.parcelId]).then(function (result) {
        if (result.rows[0]) {
          res.status(200).json({
            status: 200,
            data: [{
              id: result.rows[0].id,
              currentLocation: result.rows[0].currentlocation,
              message: 'Parcel current location updated'
            }]
          });
        }
      }).catch(function (e) {
        return res.status(404).send({
          status: 404,
          error: 'The parcel delivery you requested cannot be found'
        });
      });
    } else {
      res.status(403).send({
        status: 403,
        error: 'You don\'t have permissions to change the current location of this order'
      });
    }
  }).catch(function (e) {
    return res.status(404).send({
      status: 404,
      error: 'The parcel delivery you requested cannot be found'
    });
  });
}); // end of route

exports.default = router;