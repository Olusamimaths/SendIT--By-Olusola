'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _auth = require('../../middleware/auth');

var _db = require('../../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userId = '';

var changeStatus = function changeStatus(req, res, next) {
  _db2.default.query('SELECT placedby FROM parcels WHERE id = $1', [req.params.parcelId]).then(function (r) {
    if (r.rowCount === 0) {
      return res.status(403).send({
        status: 403,
        error: 'The Parcel Delivery you requested does not exist'
      });
    }
    // getting the user id
    userId = r.rows[0].placedby;
    // checking if logged in user is admin
    if (_auth.userData.isadmin) {
      var query = 'UPDATE parcels SET status = $1 where id = $2 RETURNING *';
      _db2.default.query(query, [req.body.status, req.params.parcelId]).then(function (result) {
        // get the new status
        var newStatus = result.rows[0].status;

        if (result.rows[0]) {
          var orderId = result.rows[0].id;
          res.status(200).json({
            status: 200,
            data: [{
              id: orderId,
              status: newStatus,
              message: 'Parcel status updated'
            }]
          });
          // SENDING OF EMAIL/////////////////////////////////////////
          // get the user info
          _db2.default.query('SELECT username, email FROM users where id = $1', [userId], function (err, response) {
            if (err) {
              console.log(err.stack);
            } else {
              // setting up the transport for nodemailer
              var transporter = _nodemailer2.default.createTransport({
                service: 'gmail',
                auth: {
                  user: 'solathecoder@gmail.com',
                  pass: process.env.G_PASS
                }
              });
              // setting the email options
              var mailOptions = {
                from: 'solathecoder@gmail.com',
                to: '' + response.rows[0].email,
                subject: 'The status of your order has been changed by an admin',
                text: 'Hello ' + response.rows[0].username + ', the status of your parcel delivery order (id: ' + req.params.parcelId + ')has been changed to ' + newStatus,
                replyTo: 'solathecoder@gmail.com'
              };
              // send the mails
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log('error', 'Something went wrong, email not sent', err);
                } else {
                  console.log('success', 'email sent', info);
                }
              });
            }
          }); // End of query to select email
          // END OF EMAIL ///////////////////////////////////////////////////////
        }
      }) // catch error if UPDATE fails
      .catch(function (e) {
        return res.status(404).send({
          status: 404,
          error: 'The parcel delivery you requested cannot be found'
        });
      });
    } else {
      return res.status(403).send({
        status: 403,
        error: 'You don\'t have permissions to change the status of this order'
      });
    }
  }) // catch erro if placedBy could not be SELECTed
  .catch(function (e) {
    return res.status(404).send({
      status: 404,
      error: 'The parcel delivery you requested cannot be found',
      e: e
    });
  });
};

exports.default = changeStatus;