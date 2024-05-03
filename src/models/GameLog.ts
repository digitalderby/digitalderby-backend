import mongoose, { Schema } from 'mongoose';

interface IGameResults {
  rankings: number[];
}

interface IGameLog {
  horses: mongoose.Types.ObjectId[];
  results: IGameResults;
}

const gameResultsSchema = new mongoose.Schema<IGameResults>({
  rankings: [
    {
      type: Number,
    },
  ],
});

const gameLogSchema = new mongoose.Schema<IGameLog>(
  {
    horses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Horse',
      },
    ],
    results: {
      type: gameResultsSchema,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('GameLog', gameLogSchema);
