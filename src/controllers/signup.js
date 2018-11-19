import express from 'express';
import client from '../models/db';
const router = express.Router();

router.get('/signup', (req, res, next) => {
  const { username } = req.body;
});

export default router;
