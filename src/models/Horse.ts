import mongoose from 'mongoose'

interface IHorse {
    name: string,
    icons: string[],
    color: string,
    stats: object,
}

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
        type: Object,
        required: true,
    },
}, { timestamps: true })

export default mongoose.model('GameLog', horseSchema)
