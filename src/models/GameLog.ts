import mongoose from 'mongoose'

interface IGameLog {
}

const gameLogSchema = new mongoose.Schema<IGameLog> ({
})

export default mongoose.model('GameLog', gameLogSchema)
