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
  
  // defining the query
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    } else {
      const query = 'INSERT INTO users(username, firstname, lastname, othernames, email, isadmin, registered, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
      const values = [username, firstname, lastname, othernames, email, isadmin, registered, hash];
      client.query(query, values)
        .then((result) => {
          res.status(201).send({
            message: 'User Created',
          });
        })
        .catch(error => res.send(error.stack));
    }
  });
});

export default router;
