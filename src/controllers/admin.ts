import { NextFunction, Request, Response } from "express"
import gameServer from "../game/gameServer.js"
import { server } from "../app.js"

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

export async function getServerStatus(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ serverStatus: gameServer.serverStatus })
}

export async function startRaceServer(req: Request, res: Response, next: NextFunction) {
    gameServer.createServer(server)

    res.status(200).json({ message: 'Server is now active' })
}

export async function stopRaceServer(req: Request, res: Response, next: NextFunction) {
    gameServer.closeServer()

    res.status(200).json({ message: 'Server is now inactive' })
}

export async function startRaceLoop(req: Request, res: Response, next: NextFunction) {
    gameServer.startMainLoop()

    res.status(200).json({ message: 'Server main loop has begun' })
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
