import express from 'express';
import signUp from '../controller/signup';

const router = express.Router();

router.post('/auth/signup', signUp);

export default router;
