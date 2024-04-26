import express from 'express'
import { loggedInAsAdmin } from '../auth/authentication.js'
import dummyRouter from '../dummyHandler.js'

const router = express.Router()

router.get('/', dummyRouter)
router.get('/:id', dummyRouter)
router.get('/:id/lastGames', dummyRouter)

export default router
