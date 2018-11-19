'use strict';

var parcel = {
  status: 200,
  data: [{
    id: 2,
    weight: req.body.weight,
    weightmetric: req.body.weight,
    from: req.body.from,
    to: req.body.to,
    currentlocation: req.body.location,
    message: 'order created'
  }]
};