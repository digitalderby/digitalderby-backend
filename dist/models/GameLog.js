import mongoose, { Schema } from 'mongoose';
const gameResultsSchema = new mongoose.Schema({
    rankings: [{
            type: Number,
        }]
});
const gameLogSchema = new mongoose.Schema({
    horses: [{
            type: Schema.Types.ObjectId,
            ref: 'Horse',
        }],
    results: {
        type: gameResultsSchema,
        required: true,
    }
}, { timestamps: true, });
export default mongoose.model('GameLog', gameLogSchema);
