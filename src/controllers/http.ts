import { NextFunction, Request, Response } from "express"

export async function getCurrentGame(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function getWallet(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function getBetOnCurrentGame(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function setBetOnCurrentGame(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function clearBetOnCurrentGame(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

