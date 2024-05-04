"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Horse = exports.generateNewHorses = void 0;
var mongoose_1 = require("mongoose");
var random_js_1 = require("../random/random.js");
var globalsettings_js_1 = require("../config/globalsettings.js");
var firstNames = [
    'Dashing',
    'Blazing',
    'Swift',
    'Shocking',
    'Galloping',
    'Great',
    'Super',
    'Ultra',
    'Mega',
    'Extreme',
];
var secondNames = [
    'Stallion',
    'Thunderhoof',
    'Nightshade',
    'Raven',
    'Thunder',
    'Wake',
    'Blue',
    'Red',
    'Sprinter',
    'Glider',
    'Pegasus',
    'Shadow',
    'Flash',
    'Spirit',
    'Silver',
    'Gold',
    'Lightning',
];
var colors = [
    'Red',
    'Orange',
    'Yellow',
    'Green',
    'Blue',
    'Purple',
    'Black',
    'Brown',
    'Mocha',
    'Amber',
    'Gold',
    'Ebony',
    'Ivory',
];
var horseStatsSchema = new mongoose_1.default.Schema({
    topSpeed: {
        type: Number,
        required: true,
    },
    stamina: {
        type: Number,
        required: true,
    },
    acceleration: {
        type: Number,
        required: true,
    },
});
var horseSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    icons: [
        {
            type: String,
        },
    ],
    color: {
        type: String,
        required: true,
    },
    stats: {
        type: horseStatsSchema,
        required: true,
    },
}, { timestamps: true });
function generateNewHorses() {
    return Array.from({ length: globalsettings_js_1.HORSE_POPULATION }, function (_, i) {
        var randomFirstName = firstNames[(0, random_js_1.randRange)(0, firstNames.length - 1)];
        var randomSecondName = secondNames[(0, random_js_1.randRange)(0, secondNames.length - 1)];
        var randomColor = colors[(0, random_js_1.randRange)(0, colors.length - 1)];
        return {
            name: "".concat(randomFirstName, " ").concat(randomSecondName),
            icons: ['🐎'],
            color: randomColor,
            stats: {
                topSpeed: (0, random_js_1.rollDiceDropLowest)(6, 4, 3),
                stamina: (0, random_js_1.rollDiceDropLowest)(6, 4, 3),
                acceleration: (0, random_js_1.rollDiceDropLowest)(6, 4, 3),
            },
        };
    });
}
exports.generateNewHorses = generateNewHorses;
exports.Horse = mongoose_1.default.model('Horse', horseSchema);
