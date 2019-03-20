'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auth = require('../../middleware/auth');

var _db = require('../../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cancelOrder = function cancelOrder(req, res, next) {
  _db2.default.query('SELECT placedby FROM parcels WHERE id = $1', [req.params.parcelId]).then(function (r) {
    if (r.rowCount === 0) {
      res.status(404).send({
        status: 404,
        error: 'The parcel you requested cannot be found'
      });
    } else if (r.rows[0].placedby === _auth.userData.id) {
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
};

exports.default = cancelOrder;