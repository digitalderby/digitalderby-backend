import mongoose from 'mongoose'

interface IGlobalSettings {
    adminPasswordHash: string,
    horsePopulation: number,
    numHorsesInRace: number,
    autostart: boolean,
}

const globalSettingsSchema = new mongoose.Schema<IGlobalSettings> ({
    adminPasswordHash: {
        type: String,
    },
    horsePopulation: {
        type: Number,
        min: 1,
    },
    numHorsesInRace: {
        type: Number,
        min: 1,
    },
    autostart: {
        type: Boolean,
        default: false,
    }
})

export default mongoose.model('GameLog', globalSettingsSchema)
