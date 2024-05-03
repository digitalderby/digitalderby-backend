import { NextFunction, Request, Response } from 'express';
import { args } from './app.js';

export async function disabledInReadOnlyMode(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (args.readOnly) {
    res.status(400).json('Cannot perform operation in read-only mode.');
  } else {
    next();
  }
}
