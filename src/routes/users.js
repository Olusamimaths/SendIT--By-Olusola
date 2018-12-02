import express from 'express';
import cors from 'cors';
import { checkAuth } from '../middleware/auth';
import getMyParcels from '../controller/users/getAll';
import cancelOrder from '../controller/users/cancelOrder';
import changeDestination from '../controller/users/changeDestination';

const app = express();
app.use(cors());
app.options('*', cors());

const router = express.Router();

// getting all parcel Delivery orders
router.get('/users/:userId/parcels', checkAuth, getMyParcels);

// changing the destination of a parcel delivery order
router.patch('/parcels/:parcelId/destination', checkAuth, changeDestination); // end of route

// Cancelling a delivery order
router.patch('/parcels/:parcelId/cancel', checkAuth, cancelOrder); // end of route

export default router;
