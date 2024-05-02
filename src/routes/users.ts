import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
  createUser,
} from "../controllers/users.js";
import { loggedInAsAdmin } from "../auth/authentication.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:uname", getUserByUsername);

router.post("/", createUser);

router.patch("/:uname", loggedInAsAdmin, updateUser);
router.delete("/:uname", loggedInAsAdmin, deleteUser);

export default router;
