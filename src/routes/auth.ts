import express from 'express'
import dummyRouter from '../dummyHandler.js'
import { loggedInAsUser } from '../auth/authentication.js'

const router = express.Router()

router.post('/login', dummyRouter)
router.post('/signup', dummyRouter)
router.delete('/deleteAccount', loggedInAsUser, dummyRouter)

export default router
