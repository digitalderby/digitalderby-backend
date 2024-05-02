import mongoose, { Schema } from "mongoose";
const betSchema = new mongoose.Schema({
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
});
const profileSchema = new mongoose.Schema({
    betLog: [{
            type: betSchema,
        }],
    wallet: {
        type: Number,
        required: true,
    }
});
const userSchema = new mongoose.Schema({
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
});
export const User = mongoose.model('User', userSchema);
