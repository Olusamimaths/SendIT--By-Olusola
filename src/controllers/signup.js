import express from 'express';
import bcrypt from 'bcrypt';
import client from '../models/db';

const router = express.Router();

router.post('/signup', (req, res, next) => {
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
      return res.status(409).send({
        message: 'Mail exists',
      });
    }
  });
  
  // defining the query
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    } else if (typeof username !== 'undefined' && typeof firstname !== 'undefined' 
    && typeof lastname !== 'undefined' && typeof othernames !== 'undefined' 
    && typeof email !== 'undefined' && typeof password !== 'undefined') {
      // no field is missing
      const query = 'INSERT INTO users(username, firstname, lastname, othernames, email, isadmin, registered, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
      const values = [username, firstname, lastname, othernames, email, isadmin, registered, hash];
      client.query(query, values)
        .then((result) => {
          res.status(201).send({
            message: 'User Created',
          });
        })
        .catch(error => res.send(error.stack));
    } else { // one or more fields are missing
      res.status(500).json({
        message: 'All fields are requiered',
      });
    }
  });
});

export default router;
