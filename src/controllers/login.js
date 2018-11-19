import express from 'express';
import bcrypt from 'bcrypt';
import client from '../models/db';

const router = express.Router();

router.post('/login', (req, res, next) => {
  const { username } = req.body;
  const { email } = req.body;
  const { password } = req.body;

  const query = 'SELECT password FROM users WHERE email = $1';
  const values = [email];
  let hash = '';
  
  client.query(query, values, (err, result) => {
    if (result.rows[0]) {
      hash = result.rows[0].password;
    } 
    if (err) {
      res.status(409).send({
        message: 'Auth failed',
      });
    } else {
      // verifying the password 
      bcrypt.compare(password, hash, (error, compareRes) => {
        if (error) {
          return res.status(409).send({
            message: 'Auth failed',
          });
        }
        // if comparision is correct
        if (compareRes) {
          return res.status(200).json({
            message: 'Auth Successful',
          });
        } 
        res.status(401).json({
          message: 'Auth failed',
        });
      }); 
    }
  });
});

export default router;
