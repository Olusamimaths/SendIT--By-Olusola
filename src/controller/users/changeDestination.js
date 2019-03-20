import { userData } from '../../middleware/auth';
import client from '../../models/db';

const changeDestination = (req, res, next) => {
  client.query('SELECT placedby, status FROM parcels WHERE id = $1', [req.params.parcelId])
    .then((r) => {
      if (r.rowCount === 0) {
        res.status(404).send({
          status: 404,
          error: 'The parcel you requested cannot be found',
        });
      } else if ((r.rows[0].placedby === userData.id) && (r.rows[0].status !== 'delivered')) {
        userId = r.rows[0].placedby;  
        // after checking for permission, run the query
        const query = 'UPDATE parcel SET _to = $1 where id = $2 RETURNING *';
        if (req.body.to !== undefined) { // checking that a new desitination was provided
          client.query(query, [req.body.to, req.params.parcelId])
            .then((result) => {
              if (result.rows[0]) { // checking that a parcel was found   
                const newDestination = result.rows[0]._to;
                res.status(200).json({
                  status: 200,
                  data: [
                    {
                      to: newDestination,
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
        } else { // new destination not specified
          res.status(403).send({ 
            status: 403,
            error: 'You have to specify the new destination',
          });
        }
      } else { // unauthorized access
        res.status(403).send({ 
          status: 403,
          error: 'You don\'t have permissions to change the destination of this order',
        });
      }
    }) // could not select who placed the order, 
    .catch(e => res.status(404).send({
      status: 404,
      error: 'The parcel delivery you requested cannot be found',
    }));
};

export default changeDestination;
