import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../models/db';
require('dotenv').config();

const logIn = (req, res, next) => {
  const { username } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  let hash = '';
    
  client.query(query, values, (err, result) => {
    if (result.rows[0]) {
      hash = result.rows[0].password;
    } 
    if (err) {
      res.status(409).send({
        status: 409,
        error: 'Auth failed',
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
          // create the token
          const token = jwt.sign({
            id: result.rows[0].id,
            isadmin: result.rows[0].isadmin,
            email: result.rows[0].email,
            username: result.rows[0].username,
          }, process.env.JWT_KEY, {
            expiresIn: '1h',
          });
            // success in login
          return res.status(200).json({
            status: 200,
            message: 'Auth Successful',
            data: [
              {
                token,
                id: result.rows[0].id,
                firstname: result.rows[0].firstname,
                lastname: result.rows[0].lastname,
                othernames: result.rows[0].othernames,
                email: result.rows[0].email,
                username: result.rows[0].username,
                registered: result.rows[0].registered,
                isAdmin: result.rows[0].isadmin,
              },
            ], 
          });
        } 
        res.status(401).json({
          status: 401,
          message: 'User not found',
        });
      }); 
    }
  });
};

export default logIn;
