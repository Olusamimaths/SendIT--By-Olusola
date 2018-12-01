import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import orderRoutes from './routes/parcel';
import signupRoute from './routes/signup';
import usersRoute from './routes/users';
import loginRoute from './routes/login';
import adminRoute from './routes/admin';
require('dotenv').config();

const app = express();

// fixing CORS
// app.use((req, res, next) => {
//   // setting the headers
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Methods', 'POST, PATCH, DELETE, GET');
//   next();
// });


// setting the bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// fix for cors
app.use(cors());
app.options('*', cors());

app.all('*', (req, res, next) => {
  const origin = req.get('origin'); 
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api/v1/', orderRoutes); // url starting with /api/v1 are forwarded to router parcelRoutes
app.use('/api/v1/', signupRoute); 
app.use('/api/v1/', loginRoute); 
app.use('/api/v1/', usersRoute); 
app.use('/api/v1/', adminRoute); 

// handling errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
export default app;
