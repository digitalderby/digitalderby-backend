import mongoose, { Schema, Types } from "mongoose"

export const DEFAULT_WALLET = Number(process.env.DEFAULT_WALLET) || 100

interface IUser {
    username: string,
    passwordHash: string,
    profile: IProfile,
}

interface IProfile {
    betLog: IBet[],
    wallet: number,
}

interface IBet {
    gameId: mongoose.Types.ObjectId,
    horseId: mongoose.Types.ObjectId,
    betValue: number,
    returns: number,
}

const betSchema = new mongoose.Schema<IBet>({
    gameId: {
        type: Schema.Types.ObjectId,
        ref: 'GameLog',
        required: true,
    },
    horseId: {
        type: Schema.Types.ObjectId,
        ref: 'Horse',
        required: true,
    },
    betValue: {
        type: Number,
        required: true,
    },
    returns: {
        type: Number,
        required: true,
    }
})

const profileSchema = new mongoose.Schema<IProfile>({
    betLog: [{
        type: betSchema,
    }],
    wallet: {
        type: Number,
        required: true,
    }
})

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        match: /[a-zA-Z0-9]+/
    },
    passwordHash: {
        type: String,
        required: true,
    },
    profile: profileSchema,
})

export type UserSpec = IUser & { _id: Types.ObjectId }

export const User = mongoose.model('User', userSchema)
