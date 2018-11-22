'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auth = require('../../middleware/auth');

var _db = require('../../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var changeStatus = function changeStatus(req, res, next) {
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
};

exports.default = changeStatus;