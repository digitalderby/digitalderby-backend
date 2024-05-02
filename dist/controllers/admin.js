import gameServer from "../game/gameServer.js";
import { Horse, generateNewHorses } from '../models/Horse.js';
import { sendJSONError } from '../errorHandler.js';
import { generateLocalHorsesFromSpecs } from '../game/horse/localHorses.js';
export async function getServerSettings(req, res, next) {
    res.status(200).json({
        message: 'Server settings'
    });
}
export async function getServerStatus(req, res, next) {
    res.status(200).json({ serverStatus: gameServer.serverStatus });
}
export async function openRaceServer(req, res, next) {
    gameServer.openServer();
    res.status(200).json({ message: 'Server is now active' });
}
export async function closeRaceServer(req, res, next) {
    try {
        gameServer.closeServer();
        res.status(200).json({ message: 'Server is now inactive' });
    }
    catch (error) {
        sendJSONError(res, 500, "Could not close the server");
    }
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
