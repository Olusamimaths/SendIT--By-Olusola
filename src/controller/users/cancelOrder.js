import client from '../../models/db';

const cancelOrder = (req, res, next) => {
  client.query('SELECT placedby FROM parcels WHERE id = $1', [req.params.parcelId])
    .then((r) => {
      if (r.rowCount === 0) {
        res.status(404).send({
          status: 404,
          error: 'The parcel you requested cannot be found',
        });
      } else if (r.rows[0].placedby === req.userData.id) {
        const query = 'DELETE FROM parcels WHERE id = $1 RETURNING *';
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
};

export default cancelOrder;
