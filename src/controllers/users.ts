import { NextFunction, Request, Response } from "express"
import { sendJSONError } from "../errorHandler.js"
import User from "../models/User.js"

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const usernames = await User.find(
            {},
            'username'
        )
        res.status(200).json(usernames)
    } catch (error) {
        sendJSONError(res, 500, `Internal error retrieving users: ${error}`)
    }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}
