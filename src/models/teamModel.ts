import mongoose, { Schema } from "mongoose";
import { Driver } from "./driverModel";

// Define the Team Schema interface
interface ITeam extends mongoose.Document {
  team_id: string; // Add team_id to the interface
  name: string;
  country: string;
  countryCode: string;
  principal: string;
  base: string;
  founded_year: number;
  engine: string;
  drivers: Array<{
    driver_id: string;
    position: number;
  }>;
  image: string;
}

const teamSchema = new mongoose.Schema<ITeam>(
  {
    team_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    principal: {
      type: String,
      required: true,
      trim: true,
    },
    base: {
      type: String,
      required: true,
      trim: true,
    },
    founded_year: {
      type: Number,
      required: true,
    },
    engine: {
      type: String,
      required: true,
      trim: true,
    },
    drivers: [
      {
        driver_id: {
          type: String, // Assuming the driver ID is a string
          required: true,
        },
        position: {
          type: Number,
          required: true,
        },
      },
    ],
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Team = mongoose.model<ITeam>("Team", teamSchema);
