import { NextFunction, Request, Response } from "express"

export async function loginAsAdmin(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Created admin token'
    })
}

export async function getServerSettings(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function startRace(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function startRaceAndAutostart(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function toggleAutostart(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function createNewHorses(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}
