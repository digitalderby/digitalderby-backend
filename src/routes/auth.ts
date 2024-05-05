import express from 'express';
import { loggedInAsUser } from '../auth/authentication.js';
import {
  deleteLoggedInUser,
  loginAsUser,
  signup,
} from '../controllers/auth.js';
import { disabledInReadOnlyMode } from '../readonly.js';

const router = express.Router();

router.post('/login', loginAsUser);
router.post('/signup', disabledInReadOnlyMode, signup);
router.delete('/deleteAccount', loggedInAsUser, deleteLoggedInUser);

export default router;
