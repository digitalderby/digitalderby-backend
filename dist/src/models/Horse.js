import mongoose from 'mongoose';
import { randRange, rollDiceDropLowest } from '../random/random.js';
import { HORSE_POPULATION } from '../game/horse/localHorses.js';
const firstNames = [
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
const secondNames = [
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
const colors = [
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
const horseStatsSchema = new mongoose.Schema({});
const horseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icons: [{
            type: String,
        }],
    color: {
        type: String,
        required: true,
    },
    stats: {
        type: Object,
        required: true,
    },
}, { timestamps: true });
export function generateNewHorses() {
    return Array.from({ length: HORSE_POPULATION }, (_, i) => {
        const randomFirstName = firstNames[randRange(0, firstNames.length - 1)];
        const randomSecondName = secondNames[randRange(0, secondNames.length - 1)];
        const randomColor = colors[randRange(0, colors.length - 1)];
        return {
            name: `${randomFirstName} ${randomSecondName}`,
            icons: ["🐎"],
            color: randomColor,
            stats: {
                topSpeed: rollDiceDropLowest(6, 4, 3),
                stamina: rollDiceDropLowest(6, 4, 3),
                acceleration: rollDiceDropLowest(6, 4, 3),
            }
        };
    });
}
export const Horse = mongoose.model('Horse', horseSchema);
