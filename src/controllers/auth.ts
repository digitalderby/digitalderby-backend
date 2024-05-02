import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { saltPassword, verifyPassword } from "../auth/password.js";
import { jwtSecret } from '../auth/secrets.js';
import { markDeletedUser } from '../auth/tokens.js';
import { sendJSONError } from '../errorHandler.js';
import { DEFAULT_WALLET } from '../config/globalsettings.js';

export async function signup(req: Request, res: Response, next: NextFunction) {
    const foundUser = await User.findOne({ username: req.body.username })
    if (foundUser) {
        return sendJSONError(res, 409, `User ${req.body.username} already exists`)
    }

    if (req.body.password.length < 5) {
        return sendJSONError(res, 409, `Password is too short`)
    }

    if (req.body.username === 'admin') {
        return sendJSONError(res, 401, `Nice try.`)
    }

    const passwordHash = await saltPassword(req.body.password)

    try {
        const user = await User.create({
            username: req.body.username,
            passwordHash: passwordHash,
            profile: {
                betLog: [],
                wallet: DEFAULT_WALLET,
                bankruptcies: 0,
            }
        })

        const loginToken = jwt.sign(
            { username: req.body.username },
            jwtSecret,
            { expiresIn: '1d' },
        )

        res.status(201).json({ 
            message: `Successfully created user ${user.username}`,
            token: loginToken
        })
    } catch (error) {
        sendJSONError(res, 500, `Internal error creating profile: ${error}`)
    }
}

export async function loginAsUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) {
            return sendJSONError(res, 404, `User not found`)
        }

        if (!(await verifyPassword(req.body.password, user.passwordHash))) {
            return sendJSONError(res, 400, `Password does not match`)
        }

        const loginToken = jwt.sign(
            { 
                username: req.body.username,
                isAdmin: req.body.username === 'admin',
            },
            jwtSecret,
            { expiresIn: '1d' },
        )

        res.status(200).json({
            message: `Successfully logged in as user ${user.username}`,
            token: loginToken,
        })
    } catch (error) {
        sendJSONError(res, 500, `Internal error creating profile: ${error}`)
    }
}

// TODO: Make this more robust security-wise by invalidating any and all tokens
// referring to deleted users
export async function deleteLoggedInUser(req: Request, res: Response, next: NextFunction) {
    try {
        // Check if the user is in the database first
        const userToDelete = req.body.jwtPayload.username;

        // Cannot delete the admin
        if (req.body.jwtPayload.username === 'admin') {
            return sendJSONError(res, 409, 'Cannot delete admin user')
        }

        const user = await User.findOne(userToDelete);

        if (!user) {
          return sendJSONError(res, 404, `User ${userToDelete} not found`);
        }

        // Now delete
        await User.deleteOne({ user: req.body.jwtPayload.username })

        markDeletedUser(req.body.jwtPayload.username)

        res.status(200).json({ message: 'Successfully deleted account' })
    } catch (error) {
        next({ status: '500', message: `Internal error deleting user: ${error}` })
    }
}
