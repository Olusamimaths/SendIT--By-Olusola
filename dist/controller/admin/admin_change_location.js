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

var changeCurrentLocation = function changeCurrentLocation(req, res, next) {
  var currentLocation = req.body.currentLocation;


  _db2.default.query('SELECT placedby FROM parcel WHERE id = $1', [req.params.parcelId]).then(function (r) {

    userId = r.rows[0].placedby;

    if (_auth.userData.isadmin) {
      var query = 'UPDATE parcel SET currentlocation = $1 where id = $2 RETURNING *';
      _db2.default.query(query, [currentLocation, req.params.parcelId]).then(function (result) {
        if (result.rows[0]) {
          res.status(200).json({
            status: 200,
            data: [{
              id: result.rows[0].id,
              currentLocation: result.rows[0].currentlocation,
              message: 'Parcel current location updated'
            }]
          });
        }
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
              subject: 'The current location of your order has been changed by an admin',
              text: 'Hello ' + response.rows[0].username + ', the current location of your parcel delivery order (id: ' + req.params.parcelId + ')has been changed to: ' + currentLocation,
              replyTo: 'solathecoder@gmail.com'
            };
            // send the mails
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log('error', 'Something went wrong, email not sent', error);
              } else {
                console.log('success', 'email sent', info);
              }
            });
          }
        }); // End of query to select email
        // END OF EMAIL ///////////////////////////////////////////////////////
      }) // could not updat eh parcel
      .catch(function (e) {
        return res.status(404).send({
          status: 404,
          error: 'The parcel delivery you requested cannot be found'
        });
      });
    } else {
      res.status(403).send({
        status: 403,
        error: 'You don\'t have permissions to change the current location of this order'
      });
    }
  }) // couldnot select who placed the order
  .catch(function (e) {
    return res.status(404).send({
      status: 404,
      error: 'The parcel delivery you requested cannot be found'
    });
  });
};

exports.default = changeCurrentLocation;