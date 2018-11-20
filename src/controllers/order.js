import express from 'express';
import checkAuth from '../middleware/auth';
import client from '../models/db';
const router = express.Router();


// the forwarded routes from app.js is appended to become /api/v1/order
router.post('/parcels', checkAuth, (req, res, next) => {
  const { weight } = req.body;
  const weightMetric = `${weight} kg`;
  const { from } = req.body;
  const { to } = req.body;
  const { currentLocation } = req.body;
  const { password } = req.body;
  const status = 'Delivered';
  const sentOn = 'NOW()';
  const deliveredOn = 'NOW()';
  const { userData } = req;

  // define the query
  const query = 'INSERT INTO parcel(placedby, weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
  const values = [12, weight, weightMetric, sentOn, deliveredOn, status, from, to, currentLocation];

  client.query(query, values)
    .then((result) => {
      client.query('SELECT id FROM parcel')
        .then((r) => {
          // getting the index of the last item in the row
          const lastRow = r.rows.length - 1;
          res.status(200).send({
            status: 200,
            data: [
              {
                id: r.rows[lastRow].id, // get the id of the inserted order
                message: 'order created',
                userData,
              },
            ],
          });
        })
        .catch(e => res.status(404).json({ error: e }));
    })
    .catch(error => res.send(error.stack));
});

// Getting all orders 
router.get('/parcels', checkAuth, (req, res, next) => {
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
      status: 409,
      error: 'Could not fetch orders',
    }));
});

// Get specific parcel order
router.get('/parcels/:parcelId', checkAuth, (req, res, next) => {
  const query = 'SELECT * FROM parcel where id = $1';
  const value = [req.params.parcelId];
  // run the query  
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
          status: 404,
          error: 'No such parcel order exist',
        });
      }
    })
    .catch(e => res.send(409).json({ error: e }));
});

// changing the destination of a parcel delivery order
router.patch('/parcels/:parcelId/destination', checkAuth, (req, res, next) => {
  const query = 'UPDATE parcel SET _to = $1 where id = $2 RETURNING *';
  const value = [req.body.destination, req.params.parcelId];
  // run the query  
  client.query(query, value)
    .then((result) => {
      if (result.rows[0]) {
        res.status(200).json({
          status: 200,
          data: [
            {
              to: result.rows[0]._to,
              message: 'Parcel destination updated',
            },
          ],
        });
      } else {
        res.status(404).json({
          status: 404,
          message: 'No such parcel order exist',
        });
      }
    })
    .catch(e => res.send(409).json({ error: e }));
});

export default router;
