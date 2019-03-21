import nodemailer from 'nodemailer';
import client from '../../models/db';
import Joi from'joi';

const schema = Joi.object().keys({
  the_status: Joi.string().min(2).max(10).required()
})

let userId = '';

const changeStatus = (req, res, next) => {
  const the_status = req.body.status;
  const validationResult = Joi.validate({ the_status }, schema );

  if(!validationResult.error) {
    client.query('SELECT placedby FROM parcels WHERE id = $1', [req.params.parcelId])
    .then((r) => {
      if (r.rowCount === 0) { 
        return res.status(403).send({ 
          status: 403,
          error: 'The Parcel Delivery you requested does not exist',
        });
      }  
      // getting the user id
      userId = r.rows[0].placedby;
      // checking if logged in user is admin
      if (req.userData.isAdmin) {
        const query = 'UPDATE parcels SET status = $1 where id = $2 RETURNING *';
        client.query(query, [req.body.status, req.params.parcelId])
          .then((result) => {
            // get the new status
            const newStatus = result.rows[0].status;
        
            if (result.rows[0]) {
              const orderId = result.rows[0].id;     
              res.status(200).json({
                status: 200,
                data: [
                  {
                    id: orderId,
                    status: newStatus,
                    message: 'Parcel status updated',
                  },
                ],
              });
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
                    subject: 'The status of your order has been changed by an admin',
                    text: `Hello ${response.rows[0].username}, the status of your parcel delivery order (id: ${req.params.parcelId})has been changed to ${newStatus}`,
                    replyTo: 'solathecoder@gmail.com',
                  };
                  // send the mails
                  transporter.sendMail(mailOptions, (error, info) => {
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
          .catch(e => res.status(404).send({
            status: 404,
            error: 'The parcel delivery you requested cannot be found',
          }));
      } else {
        return res.status(403).send({ 
          status: 403,
          error: 'You don\'t have permissions to change the status of this order',
        });
      } 
    }) // catch erro if placedBy could not be SELECTed
    .catch(e => res.status(404).send({
      status: 404,
      error: 'The parcel delivery you requested cannot be found',
      e,
    }));
  } else {
    res.status(409).send({
      status: 409,
      error: 'Invalid input'
    })
  }

};

export default changeStatus;
