import { NextFunction, Request, Response } from "express";

export async function loginAsUser(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function signup(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function deleteAccount(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}
