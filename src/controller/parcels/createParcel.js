import { userData } from '../../middleware/auth';
import client from '../../models/db';

const createParcel = (req, res, next) => {
  const { weight } = req.body;
  const weightMetric = `${weight} kg`;
  const { from } = req.body;
  const { to } = req.body;
  const { currentLocation } = req.body;
  const status = 'Placed';
  const sentOn = 'NOW()';
  const deliveredOn = 'NOW()';

  // validate the values
  if (typeof weight !== 'undefined' && typeof from !== 'undefined' 
  && typeof to !== 'undefined' && typeof currentLocation !== 'undefined') {
    const query = 'INSERT INTO parcel(placedby, weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id';
    const values = [userData.id, weight, weightMetric, sentOn, deliveredOn, status, from, to, currentLocation];

    // define the query
    client.query(query, values)
      .then((r) => {
        res.status(200).send({
          status: 200,
          data: [
            {
              id: r.rows[0].id, // get the id of the inserted order
              message: 'order created',
            },
          ],
        });
      }) // end of first query
      .catch(error => res.send(error.stack));
  } else {
    res.send({
      status: 403,
      error: 'You need to fill all fields',
    });
  }
};
export default createParcel;
