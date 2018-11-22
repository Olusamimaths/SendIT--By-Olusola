import client from '../../models/db';

const getAOrder = (req, res, next) => {
  // eslint-disable-next-line radix
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(parseInt(req.params.parcelId))) {
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
  } else {
    res.send({
      status: 403,
      error: 'Invalid parcel id',
    });
  }
};

export default getAOrder;
