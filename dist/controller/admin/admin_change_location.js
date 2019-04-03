'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _db = require('../../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _joi2.default.object().keys({
  currentLocation: _joi2.default.string().min(3).required()
});

var userId = '';

var changeCurrentLocation = function changeCurrentLocation(req, res, next) {
  var currentLocation = req.body.currentLocation;

  var validationResult = _joi2.default.validate({ currentLocation: currentLocation }, schema);
  if (!validationResult.error) {
    _db2.default.query('SELECT placedby FROM parcels WHERE id = $1', [req.params.parcelId]).then(function (r) {
      // get the user id
      userId = r.rows[0].placedby;
      if (req.userData.isAdmin) {
        var query = 'UPDATE parcels SET currentlocation = $1 where id = $2 RETURNING *';
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
        }) // could not update parcel
        .catch(function (e) {
          return res.status(404).json({
            status: 404,
            error: 'The parcel delivery you requested cannot be found'
          });
        });
      } else {
        res.status(403).json({
          status: 403,
          error: 'You don\'t have permissions to change the current location of this order'
        });
      }
    }) // couldnot select who placed the order
    .catch(function (e) {
      return res.status(404).json({
        status: 404,
        error: 'The parcel delivery you requested does not exist'
      });
    });
  } else {
    res.status(409).json({
      status: 409,
      error: 'Invalid input, new location must be more than 3 characters and less than 100.'
    });
  }
};

exports.default = changeCurrentLocation;