
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../models/db';

function validateEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(String(email).toLowerCase());
}

const signUp = (req, res, next) => {
  // get the submitted values
  const { username } = req.body;
  const { firstname } = req.body;
  const { lastname } = req.body;
  const { othernames } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const isadmin = false;
  const registered = 'NOW()';

  // validate the email
  if (validateEmail(email)) {
    const text = 'SELECT password FROM users WHERE email = $1';
    const value = [email];  
    client.query(text, value, (err, result) => {
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
          } else if (typeof username !== 'undefined' && typeof firstname !== 'undefined' 
        && typeof lastname !== 'undefined' && typeof othernames !== 'undefined' 
       && typeof password !== 'undefined') {
            // no field is missing
            const query = 'INSERT INTO users(username, firstname, lastname, othernames, email, isadmin, registered, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
            const values = [username, firstname, lastname, othernames, email, isadmin, registered, hash];
            // run the query
            client.query(query, values)
              .then((r) => {
                // create the token
                const token = jwt.sign({
                  id: r.rows[0].id,
                  isadmin,
                  email, 
                  username,
                }, process.env.JWT_KEY, {
                  expiresIn: '1h',
                });
                // send the response
                res.status(200).json({
                  status: 200,
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
          } else { // one or more fields are missing
            res.status(500).json({
              status: 500,
              error: 'All fields are requiered',
            });
          }
        }); // end of password hashing
      }
    });
  } else { // end of validateEmail
    res.status(403).send({
      status: 500,
      error: 'Invalid email format',
    });
  }
};

export default signUp;
