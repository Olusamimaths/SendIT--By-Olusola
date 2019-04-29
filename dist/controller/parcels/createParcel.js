'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _db = require('../../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _joi2.default.object().keys({
  weight: _joi2.default.number().required(),
  from: _joi2.default.string().min(10).max(100).required(),
  to: _joi2.default.string().min(10).max(100).required(),
  currentLocation: _joi2.default.string().min(10).max(100).required()
});

var createParcel = function createParcel(req, res, next) {
  var _req$body = req.body,
      weight = _req$body.weight,
      from = _req$body.from,
      to = _req$body.to,
      currentLocation = _req$body.currentLocation;

  var weightMetric = weight + ' kg';
  var status = 'Placed';
  var sentOn = 'NOW()';
  var deliveredOn = 'NOW()';

  var result = _joi2.default.validate({
    weight: weight, from: from, to: to, currentLocation: currentLocation
  }, schema, { abortEarly: false });

  // validate the values
  if (!result.error) {
    var query = 'INSERT INTO parcels(placedby, weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id';
    var values = [req.userData.id, weight, weightMetric, sentOn, deliveredOn, status.toLowerCase(), from.toLowerCase(), to.toLowerCase(), currentLocation.toLowerCase()];

    // define the query
    _db2.default.query(query, values).then(function (r) {
      res.status(200).json({
        status: 200,
        data: [{
          id: r.rows[0].id, // get the id of the inserted order
          message: 'order created'
        }]
      });
    }) // end of first query
    .catch(function (error) {
      return res.send(error.stack);
    });
  } else {
    res.status(403).json({
      status: 403,
      error: result.error.details.map(function (detail) {
        return detail.message;
      })
    });
  }
};
exports.default = createParcel;