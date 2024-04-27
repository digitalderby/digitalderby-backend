import { NextFunction } from "express"

export async function loginAsAdmin(req, res, next: NextFunction) {
    res.status(200).json({
        message: 'Created admin token'
    })
}

export async function getServerSettings(req, res, next) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function startRace(req, res, next) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function startRaceAndAutostart(req, res, next) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function toggleAutostart(req, res, next) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function createNewHorses(req, res, next) {
    res.status(200).json({
        message: 'Server settings'
    })
}
