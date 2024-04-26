import mongoose from 'mongoose'

interface IHorse {
}

const horseSchema = new mongoose.Schema<IHorse> ({
})

export default mongoose.model('GameLog', horseSchema)
