import express from 'express';
import cors from 'cors';
import { checkAuth } from '../middleware/auth';
import getMyParcels from '../controller/users/getAll';
import cancelOrder from '../controller/users/cancelOrder';
import changeDestination from '../controller/users/changeDestination';

const router = express.Router();

// getting all parcel Delivery orders
router.get('/users/:userId/parcels', cors(), checkAuth, getMyParcels);

// changing the destination of a parcel delivery order
router.patch('/parcels/:parcelId/destination', cors(), checkAuth, changeDestination); // end of route

// Cancelling a delivery order
router.patch('/parcels/:parcelId/cancel', cors(), checkAuth, cancelOrder); // end of route

export default router;
