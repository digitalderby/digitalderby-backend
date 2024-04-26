import express from 'express'
import { loggedInAsAdmin } from '../auth/authentication.js'
import dummyRouter from '../dummyHandler.js'

const router = express.Router()

router.post('/getAdminToken', dummyRouter)

router.get('/settings', loggedInAsAdmin, dummyRouter)
router.post('/startRace', loggedInAsAdmin, dummyRouter)
router.post('/startRaceAndAutostart', loggedInAsAdmin, dummyRouter)
router.post('/autostart', loggedInAsAdmin, dummyRouter)
router.post('/newHorses', loggedInAsAdmin, dummyRouter)

export default router
