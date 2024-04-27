import express from 'express'
import { getAllUsers, getUserById } from '../controllers/users.js'

const router = express.Router()

router.get('/', getAllUsers)
router.get('/:uname', getUserById)

export default router
