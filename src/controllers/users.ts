import { NextFunction, Request, Response } from "express"

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}
