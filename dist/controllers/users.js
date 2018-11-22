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

router.get('/users/:userId/parcels', _auth.checkAuth, function (req, res, next) {
  var query = 'SELECT id, placedby, weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation FROM parcel WHERE placedby = $1';
  if (_auth.userData.id === req.params.userId) {
    // check that the logged in user is the one asking for his/her orders
    _db2.default.query(query, [_auth.userData.id]).then(function (result) {
      var arr = [];
      result.rows.forEach(function (i) {
        arr.push({
          status: 200,
          data: [{
            id: i.id,
            placeBy: i.placedby,
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
  } else {
    res.status(403).json({
      status: 403,
      error: 'You are not authorized from accessing this resource'
    });
  }
});

// changing the destination of a parcel delivery order
router.patch('/parcels/:parcelId/destination', _auth.checkAuth, function (req, res, next) {
  _db2.default.query('SELECT placedby, status FROM parcel WHERE id = $1', [req.params.parcelId]).then(function (r) {
    if (r.rows[0].placedby === _auth.userData.id) {
      var query = 'UPDATE parcel SET _to = $1 where id = $2 RETURNING *';
      _db2.default.query(query, [req.body.to, req.params.parcelId]).then(function (result) {
        if (result.rows[0]) {
          res.status(200).json({
            status: 200,
            data: [{
              to: result.rows[0]._to,
              message: 'Parcel destination updated'
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
        error: 'You don\'t have permissions to change the destination of this order'
      });
    }
  }).catch(function (e) {
    return res.status(404).send({
      status: 404,
      error: 'The parcel delivery you requested cannot be found'
    });
  });
}); // end of route

// Cancelling a delivery order
router.patch('/parcels/:parcelId/cancel', _auth.checkAuth, function (req, res, next) {
  _db2.default.query('SELECT placedby FROM parcel WHERE id = $1', [req.params.parcelId]).then(function (r) {
    if (r.rows[0].placedby === _auth.userData.id) {
      var query = 'DELETE FROM parcel WHERE id = $1 RETURNING *';
      _db2.default.query(query, [req.params.parcelId]).then(function (result) {
        if (result.rows[0]) {
          res.status(200).json({
            status: 200,
            data: [{
              id: result.rows[0].id,
              message: 'Order Canceled'
            }]
          });
        }
      }).catch(function (e) {
        return res.send(e.stack);
      });
    } else {
      res.send({
        status: 403,
        error: 'You don\'t have permissions to cancel this parcel delivery order'
      });
    }
  }).catch(function (e) {
    return res.send(e.stack);
  });
}); // end of route
exports.default = router;