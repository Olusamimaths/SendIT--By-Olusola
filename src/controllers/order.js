import express from 'express';
import client from '../models/db';
const router = express.Router();


// the forwarded routes from app.js is appended to become /api/v1/order
router.post('/order', (req, res, next) => {
  const { weight } = req.body;
  const weightMetric = `${weight} kg`;
  const { from } = req.body;
  const { to } = req.body;
  const { currentLocation } = req.body;
  const { password } = req.body;
  const status = 'Delivered';
  const sentOn = 'NOW()';
  const deliveredOn = 'NOW()';
  const placedBy = 12; // this will be gotten from the users table

  const query = 'INSERT INTO parcel(placedby, weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
  
  const values = [placedBy, weight, weightMetric, sentOn, deliveredOn, status, from, to, currentLocation];
  
  client.query(query, values)
    .then((result) => {
      res.status(200).send({
        message: 'Saved',
      });
    })
    .catch(error => res.send(error.stack));
});

// Getting all orders 
router.get('/parcels', (req, res, next) => {
  const query = 'SELECT weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation FROM parcel';
  client.query(query)
    .then((result) => {
      const arr = [];
      result.rows.forEach((i) => {
        arr.push({
          status: 200,
          data: [
            {
              weight: i.weight,
              weightMetric: i.weightMetric,
              sentOn: i.senton,
              deliveredOn: i.deliveredon,
              status: i.status,
              from: i._from,
              to: i._to,
              currentLocation: i.currentlocation,
            },
          ],
        });
      });
      res.status(200).json({
        parcelOrders: arr,
      });
    })
    .catch(e => res.status(409).json({
      message: e.stack,
    }));
});

// Get specific parcel order
router.get('/parcels/:parcelId', (req, res, next) => {
  const query = 'SELECT * FROM parcel where id = $1';
  const value = [req.params.parcelId];
 
  
  client.query(query, value)
    .then((result) => {
      if (result.rows[0]) {
        res.status(200).json({
          status: 200,
          data: [
            {
              weight: result.rows[0].weight,
              weightMetric: result.rows[0].weightMetric,
              sentOn: result.rows[0].senton,
              deliveredOn: result.rows[0].deliveredon,
              status: result.rows[0].status,
              from: result.rows[0]._from,
              to: result.rows[0]._to,
              currentLocation: result.rows[0].currentlocation,
            },
          ],
        });
      } else {
        res.status(404).json({
          message: 'No such parcel order exist',
        });
      }
    })
    .catch(e => res.send(409).json({ error: e }));
});

export default router;
