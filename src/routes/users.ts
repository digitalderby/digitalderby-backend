import express from 'express'
import { deleteUser, getAllUsers, getUserById } from '../controllers/users.js'
import { loggedInAsAdmin } from '../auth/authentication.js'

const router = express.Router()

router.get('/', getAllUsers)
router.get('/:uname', getUserById)
router.delete('/:uname', loggedInAsAdmin, deleteUser)

export default router
