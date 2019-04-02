
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import client from '../models/db';

const schema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30)
.required(),
  firstname: Joi.string().alphanum().min(3).max(30)
.required(),
  lastname: Joi.string().alphanum().min(3).max(30)
.required(),
  othernames: Joi.string().alphanum().min(3).max(30)
.required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  email: Joi.string().email({ minDomainAtoms: 2 })
});

const signUp = (req, res, next) => {
  // get the submitted values
  const {
 username, firstname, lastname, othernames, email, password 
} = req.body;
  const isAdmin = false;
  const registered = 'NOW()';
  const result = Joi.validate({
    username, firstname, lastname, othernames, password, email,
  }, schema);

  // validate the email
  if (!result.error) {
    const text = 'SELECT password FROM users WHERE email = $1';
    const value = [email];
    client.query(text, value, (err, result) => {
      // if the email is already in the database
      if (result.rows[0]) {
        res.status(409).json({
          status: 409,
          message: 'Mail exists',
        });
      } else {
        // hash the password
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              status: 500,
              error: err,
            });
          } else {
            // no field is missing
            const query = 'INSERT INTO users(username, firstname, lastname, othernames, email, isAdmin, registered, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
            const values = [username, firstname, lastname, othernames, email, isAdmin, registered, hash];
            // run the query
            client.query(query, values)
              .then((r) => {
                // create the token
                const token = jwt.sign({
                  id: r.rows[0].id,
                  isAdmin,
                  email,
                  username,
                }, process.env.JWT_KEY, {
                  expiresIn: '8000h',
                });
                // send the response
                res.status(200).json({
                  status: 200,
                  message: 'Signed up successfully',
                  data: [
                    {
                      token,
                      id: r.rows[0].id,
                      firstname: r.rows[0].firstname,
                      lastname: r.rows[0].lastname,
                      othernames: r.rows[0].othernames,
                      email: r.rows[0].email,
                      username: r.rows[0].username,
                      registered: r.rows[0].registered,
                      isAdmin: r.rows[0].isadmin,
                    },
                  ],
                });
              })
              .catch(error => res.send(error.stack));
          }
        }); // end of password hashing
      }
    });
  } else { // end of validateEmail
    res.status(500).send({
      status: 500,
      error: result.error.details[0].message,
    });
  }

};

export default signUp;
