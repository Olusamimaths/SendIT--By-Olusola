import express from 'express';
import cors from 'cors';
import changeStatus from '../controller/admin/admin_change_status';
import changeCurrentLocation from '../controller/admin/admin_change_location';
import { checkAuth } from '../middleware/auth';

const router = express.Router();

router.use(cors());

// changing the status of a parcel delivery order
router.patch('/parcels/:parcelId/status', checkAuth, changeStatus); // end of route

// changing the current location of a parcel delivery order
router.patch('/parcels/:parcelId/currentlocation', checkAuth, changeCurrentLocation); // end of route

export default router;
