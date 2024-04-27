import express from 'express'
import { loggedInAsAdmin } from '../auth/authentication.js'
import { createNewHorses, getServerSettings, loginAsAdmin, startRace, startRaceAndAutostart, toggleAutostart } from '../controllers/admin.js'

const router = express.Router()

router.post('/getAdminToken', loginAsAdmin)

router.get('/settings', loggedInAsAdmin, getServerSettings)
router.post('/startRace', loggedInAsAdmin, startRace)
router.post('/startRaceAndAutostart', loggedInAsAdmin, startRaceAndAutostart)
router.post('/autostart', loggedInAsAdmin, toggleAutostart)
router.post('/newHorses', loggedInAsAdmin, createNewHorses)

export default router
