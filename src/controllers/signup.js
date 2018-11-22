import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../models/db';

const router = express.Router();

router.post('/auth/signup', (req, res, next) => {
  const { username } = req.body;
  const { firstname } = req.body;
  const { lastname } = req.body;
  const { othernames } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const isadmin = false;
  const registered = 'NOW()';

  const text = 'SELECT password FROM users WHERE email = $1';
  const value = [email];
  
  client.query(text, value, (err, result) => {
    if (result.rows[0]) {
      return res.status(409).json({
        status: 409,
        message: 'Mail exists',
      });
    }
  });
  // hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({
        status: 500,
        error: err,
      });
    } else if (typeof username !== 'undefined' && typeof firstname !== 'undefined' 
    && typeof lastname !== 'undefined' && typeof othernames !== 'undefined' 
    && typeof email !== 'undefined' && typeof password !== 'undefined') {
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
        message: 'All fields are requiered',
      });
    }
  });
});

export default router;
