import { NextFunction, Request, Response } from "express";
import { Horse } from "../models/Horse.js";
import { sendJSONError } from "../errorHandler.js";

export async function getAllHorses(
    req: Request,
    res: Response,
    next: NextFunction
) {
  try {
    const horses = await Horse.find({}).lean();
    res.status(200).json(horses);
  } catch (error) {
    sendJSONError(res, 500, `Internal error retrieving users: ${error}`);
  }
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

