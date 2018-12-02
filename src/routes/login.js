import express from 'express';
import cors from 'cors';
import logIn from '../controller/login';
const router = express.Router();

const app = express();
app.use(cors());
app.options('*', cors())

router.post('/auth/login', logIn);

export default router;
