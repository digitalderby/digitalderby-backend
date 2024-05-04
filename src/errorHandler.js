"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendJSONError = void 0;
function sendJSONError(res, statusCode, message) {
    // If the error code is greater than 500 and we are in production mode,
    // then only say 'Internal Error'. Otherwise show the full stacktrace
    var description = statusCode >= 500 && process.env.NODE_ENV === 'production'
        ? 'Internal Error'
        : message;
    res.status(statusCode).json({
        status: statusCode,
        message: description,
    });
}
exports.sendJSONError = sendJSONError;
