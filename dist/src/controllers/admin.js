import jwt from 'jsonwebtoken';
import gameServer from "../game/gameServer.js";
import { server } from "../app.js";
import { verifyPassword } from "../auth/password.js";
import { adminPasswordHash, jwtSecret } from '../auth/secrets.js';
import { Horse, generateNewHorses } from '../models/Horse.js';
import { sendJSONError } from '../errorHandler.js';
import { generateLocalHorsesFromSpecs } from '../game/horse/localHorses.js';
export async function loginAsAdmin(req, res, next) {
    if (!(await verifyPassword(req.body.password, adminPasswordHash))) {
        return next({ status: 400, message: 'Could not login as admin' });
    }
    const payload = { isAdmin: true };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
    res.status(200).json({
        message: 'Created admin token',
        token: token,
    });
}
export async function getServerSettings(req, res, next) {
    res.status(200).json({
        message: 'Server settings'
    });
}
export async function getServerStatus(req, res, next) {
    res.status(200).json({ serverStatus: gameServer.serverStatus });
}
export async function startRaceServer(req, res, next) {
    gameServer.createServer(server);
    res.status(200).json({ message: 'Server is now active' });
}
export async function stopRaceServer(req, res, next) {
    gameServer.closeServer();
    res.status(200).json({ message: 'Server is now inactive' });
}
export async function startRaceLoop(req, res, next) {
    gameServer.startMainLoop();
    res.status(200).json({ message: 'Server main loop has begun' });
}
export async function startRaceAndAutostart(req, res, next) {
    res.status(200).json({
        message: 'Server settings'
    });
}
export async function toggleAutostart(req, res, next) {
    res.status(200).json({
        message: 'Server settings'
    });
}
export async function createNewHorses(req, res, next) {
    try {
        // Delete all horses already in the database first
        await Horse.deleteMany({});
        let horses = generateNewHorses()
            .map((h) => new Horse(h));
        generateLocalHorsesFromSpecs(horses);
        await Promise.all(horses.map((hm) => hm.save()));
        res.status(200).json({
            message: 'Successfully created a new generation of horses'
        });
    }
    catch (error) {
        sendJSONError(res, 500, `Internal error creating horses: ${error}`);
    }
}
