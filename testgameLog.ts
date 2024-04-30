import mongoose, { Schema } from 'mongoose'

interface IGameResults {
    horse: mongoose.Types.ObjectId,
    results: IGameResults
  }

interface IGameLog {
    }


