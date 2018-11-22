'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auth = require('../../middleware/auth');

var _db = require('../../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createParcel = function createParcel(req, res, next) {
  var weight = req.body.weight;

  var weightMetric = weight + ' kg';
  var from = req.body.from;
  var to = req.body.to;
  var currentLocation = req.body.currentLocation;

  var status = 'Placed';
  var sentOn = 'NOW()';
  var deliveredOn = 'NOW()';

  // validate the values
  if (typeof weight !== 'undefined' && typeof from !== 'undefined' && typeof to !== 'undefined' && typeof currentLocation !== 'undefined') {
    var query = 'INSERT INTO parcel(placedby, weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id';
    var values = [_auth.userData.id, weight, weightMetric, sentOn, deliveredOn, status, from, to, currentLocation];

    // define the query
    _db2.default.query(query, values).then(function (r) {
      res.status(200).send({
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
    res.send({
      status: 403,
      error: 'You need to fill all fields'
    });
  }
};
exports.default = createParcel;