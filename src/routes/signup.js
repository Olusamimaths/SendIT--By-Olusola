import express from 'express';
import cors from 'cors';
import signUp from '../controller/signup';

const router = express.Router();

router.post('/auth/signup', signUp);

router.use(cors())
export default router;
