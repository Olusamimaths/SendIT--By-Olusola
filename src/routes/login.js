import express from 'express';
import cors from 'cors';
import logIn from '../controller/login';
const router = express.Router();

router.post('/auth/login', cors(), logIn);

export default router;
