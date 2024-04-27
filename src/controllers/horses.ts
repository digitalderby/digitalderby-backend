import { NextFunction, Request, Response } from "express";

export async function getAllHorses(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function getHorseById(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

export async function getHorsesLastGames(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: 'Server settings'
    })
}

