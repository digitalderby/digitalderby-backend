import express from 'express'
import { loggedInAsUser } from '../auth/authentication.js'
import { clearBetOnCurrentGame, getBetOnCurrentGame, getCurrentGame, getWallet, setBetOnCurrentGame } from '../controllers/http.js'

const router = express.Router()

router.get('/currentGame', getCurrentGame)

router.get('/wallet', loggedInAsUser, getWallet)
router.get('/currentGame/bet', loggedInAsUser, getBetOnCurrentGame)
router.put('/currentGame/bet', loggedInAsUser, setBetOnCurrentGame)
router.delete('/currentGame/bet', loggedInAsUser, clearBetOnCurrentGame)

export default router
