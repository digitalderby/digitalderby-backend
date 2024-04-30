import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express"
import gameServer from "../game/gameServer.js"
import { verifyPassword } from "../auth/password.js"
import { adminPasswordHash, jwtSecret } from '../auth/secrets.js'
import { Horse, IHorse, generateNewHorses } from '../models/Horse.js'
import { sendJSONError } from '../errorHandler.js'
import { generateLocalHorsesFromSpecs } from '../game/horse/localHorses.js'

export async function loginAsAdmin(req: Request, res: Response, next: NextFunction) {
    if (!(await verifyPassword(req.body.password, adminPasswordHash))) {
        return next({ status: 400, message: 'Could not login as admin' })
    }
    const payload = { isAdmin: true }
    const token = jwt.sign(
        payload,
        jwtSecret,
        { expiresIn: '1d' },
    )

    res.status(200).json({
        message: 'Created admin token',
        token: token,
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

export async function openRaceServer(req: Request, res: Response, next: NextFunction) {
    gameServer.openServer()

    res.status(200).json({ message: 'Server is now active' })
}

export async function closeRaceServer(req: Request, res: Response, next: NextFunction) {
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
    try {
        // Delete all horses already in the database first
        await Horse.deleteMany({})

        let horses = generateNewHorses()
            .map((h) => new Horse(h))

        generateLocalHorsesFromSpecs(horses)

        await Promise.all(horses.map((hm) => hm.save()))

        res.status(200).json({
            message: 'Successfully created a new generation of horses'
        })
    } catch (error) {
        sendJSONError(res, 500, `Internal error creating horses: ${error}`)
    }
}
