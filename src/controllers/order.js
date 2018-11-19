import express from 'express';
import client from '../models/db';
const router = express.Router();


// the forwarded routes from app.js is appended to become /api/v1/order
router.post('/order', (req, res, next) => {
  const query = 'INSERT INTO parcel(placedBy, weight, weightMetric, senton) VALUES ($1, $2, $3, $4)';
  const values = [1000, 10, 12.23, '2018-11-8'];
  client.query(query, values)
    .then((result) => {
      res.send(result.rows[0]);
    })
    .catch(error => res.send(error.stack));
});

export default router;
