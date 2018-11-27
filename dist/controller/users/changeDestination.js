'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auth = require('../../middleware/auth');

var _db = require('../../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var changeDestination = function changeDestination(req, res, next) {
  _db2.default.query('SELECT placedby, status FROM parcel WHERE id = $1', [req.params.parcelId]).then(function (r) {
    if (r.rowCount === 0) {
      res.status(404).send({
        status: 404,
        error: 'The parcel you requested cannot be found'
      });
    } else if (r.rows[0].placedby === _auth.userData.id && r.rows[0].status !== 'delivered') {
      userId = r.rows[0].placedby;
      // after checking for permission, run the query
      var query = 'UPDATE parcel SET _to = $1 where id = $2 RETURNING *';
      if (req.body.to !== undefined) {
        // checking that a new desitination was provided
        _db2.default.query(query, [req.body.to, req.params.parcelId]).then(function (result) {
          if (result.rows[0]) {
            // checking that a parcel was found   
            var newDestination = result.rows[0]._to;
            res.status(200).json({
              status: 200,
              data: [{
                to: newDestination,
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
        // new destination not specified
        res.status(403).send({
          status: 403,
          error: 'You have to specify the new destination'
        });
      }
    } else {
      // unauthorized access
      res.status(403).send({
        status: 403,
        error: 'You don\'t have permissions to change the destination of this order'
      });
    }
  }) // could not select who placed the order, 
  .catch(function (e) {
    return res.status(404).send({
      status: 404,
      error: 'The parcel delivery you requested cannot be found'
    });
  });
};

exports.default = changeDestination;