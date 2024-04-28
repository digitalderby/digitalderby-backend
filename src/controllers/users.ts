import { NextFunction, Request, Response } from "express"
import { sendJSONError } from "../errorHandler.js"
import User from "../models/User.js"

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const usernames = await User.find(
            {},
            'username'
        ).lean()
        res.status(200).json(
            usernames.map((u) => u.username)
        )
    } catch (error) {
        sendJSONError(res, 500, `Internal error retrieving users: ${error}`)
    }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await User.findOne(
            { username: req.params.uname },
            '-passwordHash'
        )
        if (!user) {
            return sendJSONError(res, 404, `User ${req.params.uname} not found`)
        }
        res.status(200).json(user)
    } catch (error) {
        sendJSONError(res, 500, `Internal error retrieving user: ${error}`)
    }
}
