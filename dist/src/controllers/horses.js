import { Horse } from "../models/Horse.js";
import { sendJSONError } from "../errorHandler.js";
export async function getAllHorses(req, res) {
    try {
        const horses = await Horse.find({}).lean();
        res.status(200).json(horses);
    }
    catch (error) {
        sendJSONError(res, 500, `Internal error retrieving users: ${error}`);
    }
}
export async function getHorseById(req, res) {
    try {
        const horse = await Horse.findById(req.params.id).lean();
        if (!horse) {
            return sendJSONError(res, 404, `Horse not found`);
        }
        res.status(200).json(horse);
    }
    catch (error) {
        sendJSONError(res, 500, `Internal error retrieving horse: ${error}`);
    }
}
export async function getHorsesLastGames(req, res) {
    res.status(200).json({
        message: 'Server settings'
    });
}
