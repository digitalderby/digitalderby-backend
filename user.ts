import mongoose from 'mongoose';

const { Schema, model } = mongoose;

interface IUser {
  username: string;
  passwordHash: string;
  profile: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  passwordHash: {
    type: String,
    required: true
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }
}, { timestamps: true });


const User = model<IUser>('User', userSchema);
export default User;
