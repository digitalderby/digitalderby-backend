import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from './secrets.js';
import { sendJSONError } from '../errorHandler.js';

// Get the admin password from the environment and hash it
export async function loggedInAsUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let token = req.get('Authorization') || req.query.token || req.body.token;
    if (!token) {
      return sendJSONError(
        res,
        401,
        'Must provide a JWT in the Authorization header',
      );
    }
    token = token.replace('Bearer ', '');

    let payload: jwt.JwtPayload;
    try {
      const p = jwt.verify(token, jwtSecret);
      if (typeof p === 'string') {
        return sendJSONError(res, 400, 'Could not parse JWT');
      }
      payload = p;
    } catch (error) {
      return sendJSONError(res, 400, `Could not parse JWT: ${error}`);
    }

    if (
      typeof payload.username !== 'string' ||
      typeof payload.isAdmin !== 'boolean'
    ) {
      return sendJSONError(
        res,
        400,
        `JWT is missing either the username or admin status`,
      );
    }

    req.body.jwtPayload = {
      username: payload.username,
      isAdmin: payload.isAdmin,
    };

    next();
  } catch (error) {
    sendJSONError(res, 500, `Could not verify user credentials: ${error}`);
  }
}

export async function loggedInAsAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let token = req.get('Authorization') || req.query.token || req.body.token;
    if (!token) {
      return sendJSONError(
        res,
        401,
        'Must provide a JWT in the Authorization header',
      );
    }
    token = token.replace('Bearer ', '');

    let payload: jwt.JwtPayload;
    try {
      const p = jwt.verify(token, jwtSecret);
      if (typeof p === 'string') {
        return sendJSONError(res, 400, 'Could not parse JWT');
      }
      payload = p;
    } catch (error) {
      return sendJSONError(res, 400, `Could not parse JWT: ${error}`);
    }

    if (
      typeof payload.username !== 'string' ||
      typeof payload.isAdmin !== 'boolean'
    ) {
      return sendJSONError(
        res,
        400,
        `JWT is missing either the username or admin status`,
      );
    }

    if (payload.isAdmin === true) {
      req.body.isAdmin = true;
    } else {
      return sendJSONError(res, 400, 'JWT is not an admin user');
    }

    req.body.jwtPayload = {
      username: payload.username,
      isAdmin: payload.isAdmin,
    };

    next();
  } catch (error) {
    sendJSONError(res, 500, `Could not verify admin credentials: ${error}`);
  }
}
