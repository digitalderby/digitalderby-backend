import GameLog from "./models/GameLog.js";
import { Horse } from "./models/Horse.js";
import { User } from "./models/User.js";

export default async function purgeHorses() {
    // Obtain all the horse IDs and gamelog IDs, delete them all,
    // and update the users to remove any bet containing any gamelog
    // before this purge
    const horseIDs = await Horse.find().select('_id')
    const gameLogIDs = await GameLog.find(
        { horses: { $in: horseIDs } }
    ).select('_id')

    await Horse.deleteMany({ _id: { $in: horseIDs } })
    await GameLog.deleteMany({ _id: { $in: gameLogIDs } })
    await User.updateMany(
        { $pull: {
            "profile.betLog": {
                $or: [
                    { "horseId": { $in: horseIDs } },
                    { "gameId": { $in: gameLogIDs } },
                ]
            }
        } }
    )
}
