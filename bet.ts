import mongoose from "mongoose";

const { Schema, model } = mongoose;

interface IBet {
  gameId: mongoose.Types.ObjectId;
  horseId: mongoose.Types.ObjectId;
  betValue: number;
  returns: number;
}

const betSchema = new Schema<IBet>(
  {
    gameId: { type: Schema.Types.ObjectId, ref: "GameLog" },
    horseId: { type: Schema.Types.ObjectId, ref: "Horse" },
    betValue: Number,
    returns: Number,
  },
  { timestamps: true }
);

const Bet = model<IBet>("Bet", betSchema);
export default Bet;
