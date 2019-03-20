import client from '../../models/db';

const getAllOrders = (req, res, next) => {
  const query = 'SELECT * FROM parcels';
  client.query(query)
    .then((result) => {
      const arr = [];
      result.rows.forEach((i) => {
        arr.push({
          data: [
            {
              id: i.id,
              placedBy: i.placedby,
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
        status: 200,
        parcelOrders: arr,
      });
    })
    .catch(e => res.status(409).json({
      status: 409,
      error: 'Could not fetch orders',
    }));
};

export default getAllOrders;
