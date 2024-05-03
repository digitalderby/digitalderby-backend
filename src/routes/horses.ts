import express from 'express';
import {
  getAllHorses,
  getHorseById,
  getHorsesLastGames,
} from '../controllers/horses.js';
import { loggedInAsUser } from '../auth/authentication.js';

const router = express.Router();

router.get('/', getAllHorses);
router.get('/:id', getHorseById);
router.get('/:id/lastGames', getHorsesLastGames);

export default router;
