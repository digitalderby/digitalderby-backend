import mongoose from "mongoose";

const { Schema, model } = mongoose;

interface IHorse {
  name: string;
  icons: string[];
  color: string;
  stats: object;
}

const horseSchema = new Schema<IHorse>(
  {
    name: String,
    icons: [String],
    color: String,
    stats: Object,
  },
  { timestamps: true }
);

const Horse = model<IHorse>("Horse", horseSchema);
export default Horse;
