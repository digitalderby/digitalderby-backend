import { Types, UpdateQuery } from "mongoose"
import { User } from "../models/User.js"
import { DEFAULT_WALLET } from "../config/globalsettings.js"

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
    wentBankrupt: boolean = false

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

        let update: any = {
            $push: {
                "profile.betLog": {
                    gameId: gameId,
                    horseId: this.horseId,
                    betValue: this.betValue,
                    returns: this.returns,
                }
            }
        }

        if (this.wentBankrupt) {
            update = {
                ...update,
                "profile.wallet": DEFAULT_WALLET,
                $inc: {
                    "profile.bankruptcies": 1,
                },
            }
        } else {
            update = {
                ...update,
                $inc: {
                    "profile.wallet": difference
                },
            }
        }

        await User.updateOne(
            { _id: this.id },
            update
        )

        console.log('Successfully wrote the bet to database')
    }
}
