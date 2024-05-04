"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cors = {
    credentials: true,
    origin: [
        'http://localhost:5173',
        process.env.FRONTEND_DEPLOYMENT_URL || 'http://localhost:5173',
    ],
};
console.log('cors:', cors);
exports.default = cors;
