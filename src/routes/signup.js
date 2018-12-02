import express from 'express';
import cors from 'cors';
import signUp from '../controller/signup';

const router = express.Router();

router.use(cors());
router.options('*', cors());

router.post('/auth/signup', signUp);

export default router;
