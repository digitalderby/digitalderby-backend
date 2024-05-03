import express from 'express'
import { loggedInAsAdmin } from '../auth/authentication.js'
import { 
    createNewHorses,
    getServerStatus,
    openRaceServer,
    closeRaceServer
} from '../controllers/admin.js'

const router = express.Router()

router.get('/serverStatus', getServerStatus)

router.post('/startRaceServer', loggedInAsAdmin, openRaceServer)
router.post('/stopRaceServer', loggedInAsAdmin, closeRaceServer)

router.post('/newHorses', loggedInAsAdmin, createNewHorses)

export default router
