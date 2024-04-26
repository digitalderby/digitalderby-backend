import mongoose from "mongoose"

interface IUser {
}

const userSchema = new mongoose.Schema<IUser>({
})

export default mongoose.model('User', userSchema)
