import { userData } from '../../middleware/auth';
import client from '../../models/db';

const changeCurrentLocation = (req, res, next) => {
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
}

export default changeCurrentLocation;