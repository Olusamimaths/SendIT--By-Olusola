import express from 'express';
import bodyParser from 'body-parser';
import orderRoutes from './routes/parcel';
import signupRoute from './routes/signup';
import usersRoute from './routes/users';
import loginRoute from './routes/login';
import adminRoute from './routes/admin';

const app = express();

// setting the bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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
