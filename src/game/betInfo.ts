import { Types } from "mongoose"
import { User } from "../models/User.js"

export class BetInfo {
    username: string
    id: Types.ObjectId
    // Value of the bet
    betValue: number
    // Horse that they have bet on
    horseIdx: number
    horseId: Types.ObjectId 
    // Returns
    returns: number = 0

    constructor({
        username,
        id,
        betValue,
        horseIdx,
        horseId,
    }: {
        username: string,
        id: Types.ObjectId,
        betValue: number,
        horseIdx: number,
        horseId: Types.ObjectId,
    }) {
        this.username = username
        this.id = id
        this.betValue = betValue
        this.horseIdx = horseIdx
        this.horseId = horseId
    }

    async commit(gameId: Types.ObjectId) {
        const difference = this.returns - this.betValue
        console.log(`Adding ${difference} to ${this.username}'s balance`)

        await User.updateOne(
            { _id: this.id },
            {
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
            },
        )

        console.log('Successfully wrote the bet to database')
    }
}
