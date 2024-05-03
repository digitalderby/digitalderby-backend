import { Response } from 'express';

export function sendJSONError(
  res: Response,
  statusCode: number,
  message: string,
) {
  // If the error code is greater than 500 and we are in production mode,
  // then only say 'Internal Error'. Otherwise show the full stacktrace
  const description =
    statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal Error'
      : message;
  res.status(statusCode).json({
    status: statusCode,
    message: description,
  });
}
