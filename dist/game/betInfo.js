import { User } from "../models/User.js";
export class BetInfo {
    username;
    id;
    // Value of the bet
    betValue;
    // Horse that they have bet on
    horseIdx;
    horseId;
    // Returns
    returns = 0;
    constructor({ username, id, betValue, horseIdx, horseId, }) {
        this.username = username;
        this.id = id;
        this.betValue = betValue;
        this.horseIdx = horseIdx;
        this.horseId = horseId;
    }
    async commit(gameId) {
        const difference = this.returns - this.betValue;
        console.log(`Adding ${difference} to ${this.username}'s balance`);
        await User.updateOne({ _id: this.id }, {
            $inc: {
                "profile.wallet": difference
            },
            $push: {
                "profile.betLog": {
                    gameId: gameId,
                    horseId: this.horseId,
                    betValue: this.betValue,
                    returns: this.returns,
                }
            }
        });
        console.log('Successfully wrote the bet to database');
    }
}
