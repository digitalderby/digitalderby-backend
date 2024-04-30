import mongoose, { Types } from 'mongoose'
import { randRange, randomIndicesNoReplacement, rollDiceDropLowest } from '../random/random.js'
import { HORSE_POPULATION } from '../game/horse/localHorses.js'

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
]

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
]

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
]

interface IHorseStats {
    topSpeed: number,
    stamina: number,
    acceleration: number,
}

export interface IHorse {
    name: string,
    icons: string[],
    color: string,
    stats: IHorseStats,
}

const horseStatsSchema = new mongoose.Schema<IHorseStats> ({
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
})

const horseSchema = new mongoose.Schema<IHorse> ({
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
        type: horseStatsSchema,
        required: true,
    },
}, { timestamps: true })

export function generateNewHorses(): IHorse[] {
    return Array.from({length: HORSE_POPULATION}, 
        (_, i) => {
            const randomFirstName = firstNames[randRange(0, firstNames.length-1)]
            const randomSecondName = secondNames[randRange(0, secondNames.length-1)]
            const randomColor = colors[randRange(0, colors.length-1)]
            return {
                name: `${randomFirstName} ${randomSecondName}`,
                icons: ["🐎"],
                color: randomColor,
                stats: {
                    topSpeed: rollDiceDropLowest(6, 4, 3),
                    stamina: rollDiceDropLowest(6, 4, 3),
                    acceleration: rollDiceDropLowest(6, 4, 3),
                }
            }
        })
}

export type HorseSpec = IHorse & { _id: Types.ObjectId }

export const Horse = mongoose.model('Horse', horseSchema)
