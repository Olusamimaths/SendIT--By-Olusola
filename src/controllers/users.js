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
        e: e.stack,
      }));
  } else {
    res.status(403).json({
      status: 403,
      error: 'You are not authorized to access this resource',
    });
  }
});

export default router;
