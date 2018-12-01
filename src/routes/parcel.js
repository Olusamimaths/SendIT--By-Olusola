import express from 'express';
import cors from 'cors';
import getAOrder from '../controller/parcels/getAOrder';
import getAllOrders from '../controller/parcels/getAllOrders';
import createParcel from '../controller/parcels/createParcel';
import { checkAuth } from '../middleware/auth';

const router = express.Router();


// the forwarded routes from app.js is appended to become /api/v1/parcels
router.post('/parcels', cors(), checkAuth, createParcel);

// Getting all orders 
router.get('/parcels', cors(), checkAuth, getAllOrders);

// Get specific parcel order
router.get('/parcels/:parcelId', cors(), checkAuth, getAOrder);

export default router;
