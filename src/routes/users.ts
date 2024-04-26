import express from 'express'
import dummyRouter from '../dummyHandler.js'

const router = express.Router()

router.post('/', dummyRouter)
router.post('/:uname', dummyRouter)
router.post('/:uname/bets', dummyRouter)

export default router
