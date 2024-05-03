import mongoose from 'mongoose'

interface IBounds {
    low: number,
    high: number,
}

interface IWeatherEffect {
    name: string,
    weight: number,
}

export interface IGlobalSettings {
    serverTickRate: number,
    horsePopulation: number,
    numHorsesInRace: number,
    autostart: boolean,

    frontendOriginUrls: string[],

    defaultWallet: number,
    minimumBet: number,

    cheatMode: boolean,
    raceLength: number,
    
    statConfig: {
        lowSpeed: IBounds,
        midSpeed: IBounds,
        highSpeed: IBounds,
        acceleration: IBounds,
        stamina: IBounds,
    }

    tripping: {
        tripProbability: number,
        tripBaseDuration: number,
    }

    weatherEffects: [{
        name: string,
        weight: number,
    }]
}

const weatherSchema = new mongoose.Schema<IWeatherEffect>({
    name: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    }
})

const boundsSchema = new mongoose.Schema<IBounds>({
    low: Number,
    high: Number,
})

const globalSettingsSchema = new mongoose.Schema<IGlobalSettings> ({
    serverTickRate: {
        type: Number,
        default: 100,
    },
    horsePopulation: {
        type: Number,
        min: 1,
        default: 100,
    },
    numHorsesInRace: {
        type: Number,
        min: 2,
        default: 4,
    },
    autostart: {
        type: Boolean,
        default: false,
    },

    frontendOriginUrls: [{
        type: String,
    }],

    defaultWallet: {
        type: Number,
        default: 100,
    },
    minimumBet: {
        type: Number,
        default: 10,
    },

    cheatMode: {
        type: Boolean,
        default: false,
    },
    raceLength: {
        type: Number,
        default: 10000,
    },

    statConfig: {
        lowSpeed: {
            type: boundsSchema,
            default: {
                low: 400,
                high: 450,
            }
        },
        midSpeed: {
            type: boundsSchema,
            default: {
                low: 400,
                high: 450,
            }
        },
        highSpeed: {
            type: boundsSchema,
            default: {
                low: 400,
                high: 450,
            }
        },
        acceleration: {
            type: boundsSchema,
            default: {
                low: 400,
                high: 450,
            }
        },
        stamina: {
            type: boundsSchema,
            default: {
                low: 400,
                high: 450,
            }
        },
    },

    tripping: {
        tripProbability: {
            type: Number,
            default: 1/10,
        },
        tripBaseDuration: {
            type: Number,
            default: 1000,
        },
    },

    weatherEffects: {
        type: [weatherSchema],
    },
})

export default mongoose.model('GlobalSettings', globalSettingsSchema)
