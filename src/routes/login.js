import express from 'express';
import logIn from '../controller/login';
const router = express.Router();

router.post('/auth/login', logIn);

export default router;
