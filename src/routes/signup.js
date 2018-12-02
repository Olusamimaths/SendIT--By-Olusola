import express from 'express';
import cors from 'cors';
import signUp from '../controller/signup';

const router = express.Router();

express().use(cors());
express().options('*', cors());

router.post('/auth/signup', signUp);

export default router;
