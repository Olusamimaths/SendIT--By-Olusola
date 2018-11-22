import client from '../../models/db';

const getAllOrders = (req, res, next) => {
  const query = 'SELECT id, placedBy, weight, weightmetric, senton, deliveredon, status, _from, _to, currentlocation FROM parcel';
  client.query(query)
    .then((result) => {
      const arr = [];
      result.rows.forEach((i) => {
        arr.push({
          status: 200,
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
        parcelOrders: arr,
      });
    })
    .catch(e => res.status(409).json({
      status: 409,
      error: 'Could not fetch orders',
    }));
};

export default getAllOrders;
