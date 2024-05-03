import express from 'express';
import {
  addUserFavoriteHorses,
  deleteUser,
  getAllUsers,
  getUserByUsername,
  getUserFavoriteHorses,
  removeUserFavoriteHorse,
} from '../controllers/users.js';
import { loggedInAsAdmin, loggedInAsUser } from '../auth/authentication.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:uname', getUserByUsername);
router.delete('/:uname', loggedInAsAdmin, deleteUser);

router.get('/:uname/favoriteHorses', getUserFavoriteHorses);
router.post('/:uname/favoriteHorses', loggedInAsUser, addUserFavoriteHorses);
router.delete(
  '/:uname/favoriteHorses/:horseId',
  loggedInAsUser,
  removeUserFavoriteHorse,
);

export default router;
