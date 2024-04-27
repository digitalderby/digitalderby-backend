import mongoose, { Schema } from 'mongoose'

interface IGameLog {
    horses: mongoose.Types.ObjectId[],
    results: Object,
}

const gameLogSchema = new mongoose.Schema<IGameLog> (
    {
        horses: [{
            type: Schema.Types.ObjectId,
            ref: 'Horse',
        }],
        results: {
            type: Object,
            required: true,
        }
    },
    { timestamps: true, }
)

export default mongoose.model('GameLog', gameLogSchema)
