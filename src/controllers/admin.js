import express from 'express';
import { userData, checkAuth } from '../middleware/auth';
import client from '../models/db';
const router = express.Router();

// changing the status of a parcel delivery order
router.patch('/parcels/:parcelId/status', checkAuth, (req, res, next) => {
  client.query('SELECT placedby FROM parcel WHERE id = $1', [req.params.parcelId])
    .then((r) => {
      if (userData.isadmin) {
        const query = 'UPDATE parcel SET status = $1 where id = $2 RETURNING *';
        client.query(query, [req.body.status, req.params.parcelId])
          .then((result) => {
            if (result.rows[0]) {       
              res.status(200).json({
                status: 200,
                data: [
                  {
                    id: result.rows[0].id,
                    status: result.rows[0].status,
                    message: 'Parcel status updated',
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
          error: 'You don\'t have permissions to change the status of this order',
        });
      }
    })
    .catch(e => res.status(404).send({
      status: 404,
      error: 'The parcel delivery you requested cannot be found',
    }));
}); // end of route

// changing the current location of a parcel delivery order
router.patch('/parcels/:parcelId/currentlocation', checkAuth, (req, res, next) => {
  client.query('SELECT placedby FROM parcel WHERE id = $1', [req.params.parcelId])
    .then((r) => {
      if (userData.isadmin) {
        const query = 'UPDATE parcel SET currentlocation = $1 where id = $2 RETURNING *';
        client.query(query, [req.body.currentLocation, req.params.parcelId])
          .then((result) => {
            if (result.rows[0]) {       
              res.status(200).json({
                status: 200,
                data: [
                  {
                    id: result.rows[0].id,
                    currentLocation: result.rows[0].currentlocation,
                    message: 'Parcel current location updated',
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
          error: 'You don\'t have permissions to change the current location of this order',
        });
      }
    })
    .catch(e => res.status(404).send({
      status: 404,
      error: 'The parcel delivery you requested cannot be found',
    }));
}); // end of route

export default router;
