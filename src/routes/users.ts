import express from 'express'
import { getAllUsers, getUserById } from '../controllers/users.js'

const router = express.Router()

router.post('/', getAllUsers)
router.post('/:uname', getUserById)

export default router
