import express from 'express';
import {
  getAllRaces,
  getHorsesInRace,
  getLastRace,
  getRaceById,
} from '../controllers/races.js';

const router = express.Router();

router.get('/', getAllRaces);
router.get('/lastGame', getLastRace);
router.get('/:id', getRaceById);
router.get('/:id/horses', getHorsesInRace);

export default router;
