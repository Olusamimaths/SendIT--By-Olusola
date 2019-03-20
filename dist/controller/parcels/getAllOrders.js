'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _db = require('../../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getAllOrders = function getAllOrders(req, res, next) {
  var query = 'SELECT * FROM parcels';
  _db2.default.query(query).then(function (result) {
    var arr = [];
    result.rows.forEach(function (i) {
      arr.push({
        data: [{
          id: i.id,
          placedBy: i.placedby,
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
      status: 200,
      parcelOrders: arr
    });
  }).catch(function (e) {
    return res.status(409).json({
      status: 409,
      error: 'Could not fetch orders'
    });
  });
};

exports.default = getAllOrders;