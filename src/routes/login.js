import express from 'express';
import cors from 'cors';
import logIn from '../controller/login';
const router = express.Router();

express().use(cors());
express().options('*', cors());

router.post('/auth/login', logIn);

export default router;
