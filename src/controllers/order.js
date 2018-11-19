import express from 'express';
import client from '../models/db';
const router = express.Router();


// the forwarded routes from app.js is appended to become /api/v1/order
router.post('/order', (req, res, next) => {
  const query = 'INSERT INTO parcel(placedBy, weight, weightMetric, senton) VALUES ($1, $2, $3, $4)';
  const { weight } = req.body;
  const weightMetric = weight * 100;
  const placeBy = 12;
  const senton = 'NOW()';

  const values = [placeBy, weight, weightMetric, senton];
  
  client.query(query, values)
    .then((result) => {
      res.send({
        message: 'Saved',
      });
    })
    .catch(error => res.send(error.stack));
});

export default router;
