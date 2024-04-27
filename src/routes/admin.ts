import express from 'express'
import { loggedInAsAdmin } from '../auth/authentication.js'
import { 
    createNewHorses,
    getServerSettings,
    loginAsAdmin,
    startRaceAndAutostart,
    toggleAutostart,
    getServerStatus,
    startRaceLoop,
    startRaceServer,
    stopRaceServer
} from '../controllers/admin.js'

const router = express.Router()

router.post('/getAdminToken', loginAsAdmin)

router.get('/settings', loggedInAsAdmin, getServerSettings)
router.get('/serverStatus', getServerStatus)
router.post('/autostart', loggedInAsAdmin, toggleAutostart)

router.post('/startRaceServer', loggedInAsAdmin, startRaceServer)
router.post('/stopRaceServer', loggedInAsAdmin, stopRaceServer)

router.post('/startRaceLoop', loggedInAsAdmin, startRaceLoop)
router.post('/startRaceAndAutostart', loggedInAsAdmin, startRaceAndAutostart)

router.post('/newHorses', loggedInAsAdmin, createNewHorses)

export default router
