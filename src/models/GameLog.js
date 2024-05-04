"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var gameResultsSchema = new mongoose_1.default.Schema({
    rankings: [
        {
            type: Number,
        },
    ],
});
var gameLogSchema = new mongoose_1.default.Schema({
    horses: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Horse',
        },
    ],
    results: {
        type: gameResultsSchema,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('GameLog', gameLogSchema);
