import express from 'express';
import cors from 'cors';
import logIn from '../controller/login';
const router = express.Router();

router.use(cors());

router.post('/auth/login', logIn);

export default router;
