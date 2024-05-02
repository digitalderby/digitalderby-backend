import express from 'express'
import { loggedInAsAdmin } from '../auth/authentication.js'
import { 
    purgeHorses,
    getServerSettings,
    startRaceAndAutostart,
    toggleAutostart,
    getServerStatus,
    startRaceLoop,
    openRaceServer,
    closeRaceServer
} from '../controllers/admin.js'

const router = express.Router()

router.get('/settings', loggedInAsAdmin, getServerSettings)
router.get('/serverStatus', getServerStatus)
router.post('/autostart', loggedInAsAdmin, toggleAutostart)

router.post('/startRaceServer', loggedInAsAdmin, openRaceServer)
router.post('/stopRaceServer', loggedInAsAdmin, closeRaceServer)

router.post('/startRaceLoop', loggedInAsAdmin, startRaceLoop)
router.post('/startRaceAndAutostart', loggedInAsAdmin, startRaceAndAutostart)

router.post('/newHorses', loggedInAsAdmin, purgeHorses)

export default router
