import express from 'express';
import dummyRouter from '../dummyHandler.js';

const router = express.Router();

router.get('/', dummyRouter);
router.get('/lastGame', dummyRouter);
router.get('/:id', dummyRouter);
router.get('/:id/horses', dummyRouter);

export default router;
