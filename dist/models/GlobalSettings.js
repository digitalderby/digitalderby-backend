import mongoose from 'mongoose';
const globalSettingsSchema = new mongoose.Schema({
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
});
export default mongoose.model('GameLog', globalSettingsSchema);
