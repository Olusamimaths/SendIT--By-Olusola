import { userData } from '../../middleware/auth';
import client from '../../models/db';

const changeStatus = (req, res, next) => {
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
};

export default changeStatus;