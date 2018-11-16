import express from 'express';
const router = express.Router();

// the forwarded routes from app.js is appended to become /api/v1/order
router.post('/order', (req, res, next) => {
  const parcel = {
    status: 200,
    data: [
      { 
        id: 2,
        weight: req.body.weight,
        weightmetric: req.body.weight,
        from: req.body.from,
        to: req.body.to,
        currentlocation: req.body.location,
        message: 'order created',
      },
    ],
  };
  res.status(201).json({
    message: 'Handling Post requests to /order',
    createdParcel: parcel,
  });
});

export default router;
