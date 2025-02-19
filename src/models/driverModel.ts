import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    driver_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    givenName: {
      type: String,
      required: true,
      trim: true,
    },
    familyName: {
      type: String,
      required: true,
      trim: true,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
      trim: true,
    },
    // Optional: If you need the team_id reference
    team_id: {
      type: mongoose.Types.ObjectId,
      ref: "Team",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Driver = mongoose.model("Driver", driverSchema);
