import express from 'express';
import { userData, checkAuth } from '../middleware/auth';
import client from '../models/db';
const router = express.Router();

router.get('/users/:userId/parcels', checkAuth, (req, res, next) => {
  const query = 'SELECT id, placedby, weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation FROM parcel WHERE placedby = $1';
  if (userData.id === req.params.userId) { // check that the logged in user is the one asking for his/her orders
    client.query(query, [userData.id])
      .then((result) => {
        const arr = [];
        result.rows.forEach((i) => {
          arr.push({
            status: 200,
            data: [
              {
                id: i.id,
                placeBy: i.placedby,
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
  } else {
    res.status(403).json({
      status: 403,
      error: 'You are not authorized from accessing this resource',
    });
  }
});

// changing the destination of a parcel delivery order
router.patch('/parcels/:parcelId/destination', checkAuth, (req, res, next) => {
  client.query('SELECT placedby, status FROM parcel WHERE id = $1', [req.params.parcelId])
    .then((r) => {
      if (r.rows[0].placedby === userData.id) {
        const query = 'UPDATE parcel SET _to = $1 where id = $2 RETURNING *';
        client.query(query, [req.body.to, req.params.parcelId])
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
            }
          })
          .catch(e => res.status(404).send({
            status: 404,
            error: 'The parcel delivery you requested cannot be found',
          }));
      } else {
        res.status(403).send({ 
          status: 403,
          error: 'You don\'t have permissions to change the destination of this order',
        });
      }
    })
    .catch(e => res.status(404).send({
      status: 404,
      error: 'The parcel delivery you requested cannot be found',
    }));
}); // end of route

// Cancelling a delivery order
router.patch('/parcels/:parcelId/cancel', checkAuth, (req, res, next) => {
  client.query('SELECT placedby FROM parcel WHERE id = $1', [req.params.parcelId])
    .then((r) => {
      if (r.rows[0].placedby === userData.id) {
        const query = 'DELETE FROM parcel WHERE id = $1 RETURNING *';
        client.query(query, [req.params.parcelId])
          .then((result) => {
            if (result.rows[0]) {       
              res.status(200).json({
                status: 200,
                data: [
                  {
                    id: result.rows[0].id,
                    message: 'Order Canceled',
                  },
                ],
              });
            }
          })
          .catch(e => res.send(e.stack));
      } else {
        res.send({
          status: 403,
          error: 'You don\'t have permissions to cancel this parcel delivery order',
        });
      }
    })
    .catch(e => res.send(e.stack));
}); // end of route
export default router;
