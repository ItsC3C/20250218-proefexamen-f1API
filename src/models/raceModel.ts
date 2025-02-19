import mongoose, { Schema } from "mongoose";

// Define the Race Schema interface
interface IRace extends mongoose.Document {
  name: string;
  country: string;
  countryCode: string;
  position1_time: number;
  position2_time: number;
  position3_time: number;
  driver_id: mongoose.Types.ObjectId;
  round: number;
  circuit_id: string;
  date: Date;
  sprint_race: boolean;
  fastest_lap: string;
  race_results: Array<{
    position: number;
    driver_id: string;
    time: number;
    points: number;
  }>;
}

const raceSchema = new mongoose.Schema<IRace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    countryCode: {
      type: String,
      required: true,
      trim: true,
    },
    position1_time: {
      type: Number, // time in milliseconds
      required: true,
    },
    position2_time: {
      type: Number, // time in milliseconds
      required: true,
    },
    position3_time: {
      type: Number, // time in milliseconds
      required: true,
    },
    driver_id: {
      type: Schema.Types.ObjectId, // Correct usage for ObjectId
      ref: "Driver",
      required: true,
    },
    round: {
      type: Number,
      required: true,
    },
    circuit_id: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    sprint_race: {
      type: Boolean,
      required: true,
    },
    fastest_lap: {
      type: String, // This could be the driver ID who got the fastest lap
      required: true,
    },
    race_results: [
      {
        position: { type: Number, required: true },
        driver_id: { type: String, required: true }, // Assuming driver_id is a string
        time: { type: Number, required: true }, // time in milliseconds
        points: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Race = mongoose.model<IRace>("Race", raceSchema);
