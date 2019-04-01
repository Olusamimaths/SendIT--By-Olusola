import client from '../../models/db';

const getMyParcels = (req, res, next) => {
  const query = 'SELECT id, placedby, weight, weightMetric, senton, deliveredon, status, _from, _to, currentlocation FROM parcels WHERE placedby = $1';
  if (req.userData.id == req.params.userId) { // check that the logged in user is the one asking for his/her orders
    client.query(query, [req.userData.id])
      .then((result) => {
        const arr = [];
        result.rows.forEach((i) => {
          arr.push({
            data: [
              {
                id: i.id,
                placeBy: i.placedby,
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
  } else {
    res.status(403).json({
      status: 403,
      error: 'You are not authorized from accessing this resource.',
    });
  }
};

export default getMyParcels;
