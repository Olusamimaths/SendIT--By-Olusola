import express from 'express';
const router = express.Router();

// getting all parcels
router.get('/parcel', (req, res, next) => {
  res.status(200).json({
    message: 'You requested for the list of parcel',
  });
});

// getting a specific parcel order
router.get('/parcel/:parcelId', (req, res, next) => {
  const id = req.params.parcelId;
  res.status(200).json({
    message: `You requested for the parcel with the id ${id}`,
  });
});

export default router;
