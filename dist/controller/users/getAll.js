'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _db = require('../../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getMyParcels = function getMyParcels(req, res, next) {
  var query = 'SELECT id, placedby, weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation FROM parcels WHERE placedby = $1';
  if (req.userData.id == req.params.userId) {
    // check that the logged in user is the one asking for his/her orders
    _db2.default.query(query, [req.userData.id]).then(function (result) {
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
      error: 'You are not authorized from accessing this resource.'
    });
  }
};

exports.default = getMyParcels;