import mongoose from "mongoose";
import { MONGO_URI } from "./env";

const connectToDb = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectToDb;
