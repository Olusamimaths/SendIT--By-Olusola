import nodemailer from 'nodemailer';
import { userData } from '../../middleware/auth';
import client from '../../models/db';

let userId = '';

const changeCurrentLocation = (req, res, next) => {

  const { currentLocation } = req.body;

  client.query('SELECT placedby FROM parcel WHERE id = $1', [req.params.parcelId])
    .then((r) => {

      userId = r.rows[0].placedby;

      if (userData.isadmin) {
        const query = 'UPDATE parcel SET currentlocation = $1 where id = $2 RETURNING *';
        client.query(query, [currentLocation, req.params.parcelId])
          .then((result) => {
            if (result.rows[0]) {       
              res.status(200).json({
                status: 200,
                data: [
                  {
                    id: result.rows[0].id,
                    currentLocation: result.rows[0].currentlocation,
                    message: 'Parcel current location updated',
                  },
                ],
              });
            }
            // SENDING OF EMAIL/////////////////////////////////////////
            // get the user info
            client.query('SELECT username, email FROM users where id = $1', [userId], (err, response) => {
              if (err) {
                console.log(err.stack);
              } else {
                // setting up the transport for nodemailer
                const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'solathecoder@gmail.com',
                    pass: process.env.G_PASS,
                  },
                });
                // setting the email options
                const mailOptions = {
                  from: 'solathecoder@gmail.com',
                  to: `${response.rows[0].email}`,
                  subject: 'The current location of your order has been changed by an admin',
                  text: `Hello ${response.rows[0].username}, the current location of your parcel delivery order (id: ${req.params.parcelId})has been changed to: ${currentLocation}`,
                  replyTo: 'solathecoder@gmail.com',
                };
                // send the mails
                transporter.sendMail(mailOptions, (error, info) => {
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
          .catch(e => res.status(404).send({
            status: 404,
            error: 'The parcel delivery you requested cannot be found',
          }));
      } else {
        res.status(403).send({ 
          status: 403,
          error: 'You don\'t have permissions to change the current location of this order',
        });
      }
    }) // couldnot select who placed the order
    .catch(e => res.status(404).send({
      status: 404,
      error: 'The parcel delivery you requested cannot be found',
    }));
};

export default changeCurrentLocation;
