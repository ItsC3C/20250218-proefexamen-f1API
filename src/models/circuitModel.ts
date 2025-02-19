import mongoose from "mongoose";

const circuitSchema = new mongoose.Schema(
  {
    circuit_id: {
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
    image: {
      type: String,
      required: true,
    },
    location: {
      country: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
    },
    length_km: {
      type: Number,
      required: true,
    },
    turns: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists to prevent overwriting
const Circuit =
  mongoose.models.Circuit || mongoose.model("Circuit", circuitSchema);

export { Circuit };
