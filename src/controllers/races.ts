import { NextFunction, Request, Response } from 'express';
import { sendJSONError } from '../errorHandler.js';
import GameLog from '../models/GameLog.js';

export async function getAllRaces(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const races = await GameLog.find({})
      .sort({ createdAt: 'desc' })
      .populate('horses')
      .lean();
    res.status(200).json(races);
  } catch (error) {
    sendJSONError(res, 500, `Internal error retrieving users: ${error}`);
  }
}

export async function getLastRace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const race = await GameLog.findOne({})
      .sort({ createdAt: 'desc' })
      .populate('horses')
      .limit(1)
      .lean();
    if (!race) {
      return sendJSONError(res, 404, 'No races');
    }
    res.status(200).json(race);
  } catch (error) {
    sendJSONError(res, 500, `Internal error retrieving users: ${error}`);
  }
}

export async function getRaceById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const race = await GameLog.findById(req.params.id)
      .sort({ createdAt: 'desc' })
      .populate('horses')
      .lean();
    if (!race) {
      return sendJSONError(res, 404, 'Race not found');
    }
    res.status(200).json(race);
  } catch (error) {
    sendJSONError(res, 500, `Internal error retrieving users: ${error}`);
  }
}

export async function getHorsesInRace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const race = await GameLog.findById(req.params.id)
      .sort({ createdAt: 'desc' })
      .populate('horses')
      .lean();
    if (!race) {
      return sendJSONError(res, 404, 'Race not found');
    }
    res.status(200).json(race.horses);
  } catch (error) {
    sendJSONError(res, 500, `Internal error retrieving users: ${error}`);
  }
}
