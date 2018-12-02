import express from 'express';
import cors from 'cors';
import logIn from '../controller/login';

const app = express();
app.use(cors());
app.options('*', cors());

const router = express.Router();

router.post('/auth/login', logIn);

export default router;
