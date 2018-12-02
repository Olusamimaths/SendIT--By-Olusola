import express from 'express';
import cors from 'cors';
import signUp from '../controller/signup';

const app = express();
app.use(cors());
app.options('*', cors());

const router = express.Router();

router.post('/auth/signup', signUp);

export default router;
