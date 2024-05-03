import { NextFunction, Request, Response } from 'express';

export async function getAllRaces(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.status(200).json({
    message: 'Server settings',
  });
}

export async function getLastRace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.status(200).json({
    message: 'Server settings',
  });
}

export async function getRaceById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.status(200).json({
    message: 'Server settings',
  });
}

export async function getHorsesInRace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.status(200).json({
    message: 'Server settings',
  });
}
