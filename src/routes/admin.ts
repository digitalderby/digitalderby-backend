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

router.post('/openServer', loggedInAsAdmin, openRaceServer)
router.post('/closeServer', loggedInAsAdmin, closeRaceServer)

router.post('/newHorses', loggedInAsAdmin, createNewHorses)

export default router
