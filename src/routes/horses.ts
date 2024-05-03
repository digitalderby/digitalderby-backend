import express from 'express';
import {
  getAllHorses,
  getHorseById,
  getHorsesLastGames,
} from '../controllers/horses.js';

const router = express.Router();

router.get('/', getAllHorses);
router.get('/:id', getHorseById);
router.get('/:id/lastGames', getHorsesLastGames);

export default router;
