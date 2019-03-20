'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _db = require('../../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getAOrder = function getAOrder(req, res, next) {
  // eslint-disable-next-line radix
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(parseInt(req.params.parcelId))) {
    var query = 'SELECT * FROM parcels where id = $1';
    var value = [req.params.parcelId];
    // run the query  
    _db2.default.query(query, value).then(function (result) {
      if (result.rows[0]) {
        res.status(200).json({
          status: 200,
          data: [{
            id: result.rows[0].id,
            placedBy: result.rows[0].placedby,
            weight: result.rows[0].weight,
            weightMetric: result.rows[0].weightMetric,
            sentOn: result.rows[0].senton,
            deliveredOn: result.rows[0].deliveredon,
            status: result.rows[0].status,
            from: result.rows[0]._from,
            to: result.rows[0]._to,
            currentLocation: result.rows[0].currentlocation
          }]
        });
      } else {
        res.status(404).json({
          status: 404,
          error: 'No such parcel order exist'
        });
      }
    }).catch(function (e) {
      return res.status(409).json({ error: e });
    });
  } else {
    res.status(403).json({
      status: 403,
      error: 'Invalid parcel id'
    });
  }
};

exports.default = getAOrder;