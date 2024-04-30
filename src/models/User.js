"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.DEFAULT_WALLET = void 0;
var mongoose_1 = require("mongoose");
exports.DEFAULT_WALLET = Number(process.env.DEFAULT_WALLET) || 100;
var betSchema = new mongoose_1.default.Schema({
    gameId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'GameLog',
        required: true,
    },
    horseId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
var profileSchema = new mongoose_1.default.Schema({
    betLog: [{
            type: betSchema,
        }],
    wallet: {
        type: Number,
        required: true,
    }
});
var userSchema = new mongoose_1.default.Schema({
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
exports.User = mongoose_1.default.model('User', userSchema);
