import { Response } from "express";

interface JSONError {
    status: number,
    message: string,
}

/** Returns an error in JSON. */
export const errorHandler = (err: JSONError, _req: any, res: Response, _next: any) => {
    // If the error code is greater than 500 and we are in production mode,
    // then only say 'Internal Error'. Otherwise show the full stacktrace
    const description =
        (err.status >= 500 && process.env.NODE_ENV === 'production')
        ? 'Internal Error'
        : err.message
    res.status(err.status).json({
        status: err.status,
        message: description,
    });
}
