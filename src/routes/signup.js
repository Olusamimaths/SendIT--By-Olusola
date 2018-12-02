import express from 'express';
import cors from 'cors';
import signUp from '../controller/signup';

const router = express.Router();

const app = express();
app.use(cors());
app.options('*', cors());

router.post('/auth/signup', signUp);

export default router;
