import express from 'express';
import cors from 'cors';
import getAOrder from '../controller/parcels/getAOrder';
import getAllOrders from '../controller/parcels/getAllOrders';
import createParcel from '../controller/parcels/createParcel';
import { checkAuth } from '../middleware/auth';

const app = express();
app.use(cors());
app.options('*', cors());

const router = express.Router();

// router.use(cors());

// the forwarded routes from app.js is appended to become /api/v1/parcels
router.post('/parcels', checkAuth, createParcel);

// Getting all orders 
router.get('/parcels', checkAuth, getAllOrders);

// Get specific parcel order
router.get('/parcels/:parcelId', checkAuth, getAOrder);

export default router;
