import express from 'express'
import dummyRouter from '../dummyHandler.js'
import { loggedInAsUser } from '../auth/authentication.js'
import { deleteAccount, loginAsUser, signup } from '../controllers/auth.js'
import { disabledInReadOnlyMode } from '../readonly.js'

const router = express.Router()

router.post('/login', loginAsUser)
router.post('/signup', disabledInReadOnlyMode, signup)
router.delete('/deleteAccount', loggedInAsUser, deleteAccount)

export default router
