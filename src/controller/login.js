import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import client from '../models/db';

const schema = Joi.object().keys({
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  email: Joi.string().email({ minDomainAtoms: 2 }),
});

const logIn = (req, res, next) => {
  const { email, password } = req.body;

  const result = Joi.validate({ password, email }, schema);

  // log the user in
  if (!result.error) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    let hash = '';
    // run the query
    client.query(query, values, (err, result) => {
    if (result.rows[0]) {
      hash = result.rows[0].password;
    } 

    if (!result.rowCount) {
      return res.status(409).json({
        status: 409,
        error: 'Auth failed',
      });
    } 
      // verifying the password 
      bcrypt.compare(password, hash, (err, compareRes) => {
        if (!compareRes) {
          return res.status(409).json({
            status: 409,
            message: 'Auth failed',
          });
        }
        // if comparision is correct
        if (compareRes) {
          // create the token
          const token = jwt.sign({
            id: result.rows[0].id,
            isAdmin: result.rows[0].isadmin,
            email: result.rows[0].email,
            username: result.rows[0].username,
          }, process.env.JWT_KEY, {
            expiresIn: '24h',
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
      }); 
    
  });
  } else {
    res.status(500).send({
      status: 500,
      error: result.error.details[0].message,
    });
  }

};

export default logIn;
