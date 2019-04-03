import Joi from 'joi';
import client from '../../models/db';

const schema = Joi.object().keys({
  weight:Joi.number().required(),
  from: Joi.string().alphanum().min(3).max(30)
.required(),
  to: Joi.string().alphanum().min(3).max(30)
.required(),
  currentLocation: Joi.string().alphanum().min(3).max(30)
.required(),
});

const createParcel = (req, res, next) => {
  const { weight, from, to, currentLocation } = req.body;
  const weightMetric = `${weight} kg`;
  const status = 'Placed';
  const sentOn = 'NOW()';
  const deliveredOn = 'NOW()';

  const result = Joi.validate({
    weight, from, to, currentLocation
  }, schema)

  // validate the values
  if (!result.error) {
    const query = 'INSERT INTO parcels(placedby, weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id';
    const values = [req.userData.id, weight, weightMetric, sentOn, deliveredOn, status.toLowerCase(), from.toLowerCase(), to.toLowerCase(), currentLocation.toLowerCase()];

    // define the query
    client.query(query, values)
      .then((r) => {
        res.status(200).json({
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
    res.status(400).json({
      status: 403,
      error: 'One or more fields is invalid',
    });
  }
};
export default createParcel;
