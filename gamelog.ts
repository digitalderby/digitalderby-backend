import mongoose from "mongoose";

const { Schema, model } = mongoose;

interface IGameLog {
  horses: mongoose.Types.ObjectId[];
  results: object;
  timestamp: Date;
}

const gameLogSchema = new Schema<IGameLog>(
  {
    horses: [{ type: Schema.Types.ObjectId, ref: "Horse" }],
    results: Object,
    timestamp: Date,
  },
  { timestamps: true }
);

const GameLog = model<IGameLog>("GameLog", gameLogSchema);
export default GameLog;
