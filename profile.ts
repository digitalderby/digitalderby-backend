import mongoose from "mongoose";

const { Schema, model } = mongoose;

interface IProfile {
  user: mongoose.Types.ObjectId;
  betLog: mongoose.Types.ObjectId[];
  wallet: number;
}

const profileSchema = new Schema<IProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    betLog: [{ type: Schema.Types.ObjectId, ref: "Bet" }],
    wallet: Number,
  },
  { timestamps: true }
);

const Profile = model<IProfile>("Profile", profileSchema);
export default Profile;
