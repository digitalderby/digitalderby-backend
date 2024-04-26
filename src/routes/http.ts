import express from 'express'
import dummyRouter from '../dummyHandler.js'
import { loggedInAsUser } from '../auth/authentication.js'

const router = express.Router()

router.get('/currentGame', dummyRouter)

router.get('/wallet', loggedInAsUser, dummyRouter)
router.get('/currentGame/bet', loggedInAsUser, dummyRouter)
router.put('/currentGame/bet', loggedInAsUser, dummyRouter)
router.delete('/currentGame/bet', loggedInAsUser, dummyRouter)

export default router
