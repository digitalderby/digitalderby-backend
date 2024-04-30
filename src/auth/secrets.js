"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPasswordHash = exports.jwtSecret = void 0;
var password_js_1 = require("./password.js");
if (process.env.AUTH_SECRET === undefined) {
    console.log("JWT authentication secret is undefined --- setting it to 'secret'. Please define this in production!");
}
exports.jwtSecret = process.env.AUTH_SECRET || 'secret';
if (process.env.ADMIN_PASSWORD === undefined) {
    console.log("Admin password is undefined --- setting it to 'admin'. Please define this in production!");
}
var adminPassword = process.env.ADMIN_PASSWORD || 'admin';

async function initializeAdminPassword() {
    try {
        exports.adminPasswordHash = await password_js_1.saltPassword(adminPassword);
    } catch (error) {
        console.error('Error initializing admin password:', error);
    }
}

initializeAdminPassword();
