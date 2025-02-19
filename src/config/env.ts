// src/config/env.ts
import "dotenv/config";

export const PORT = process.env.PORT || "3000";
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const NODE_ENV = process.env.NODE_ENV || "development";

// Ensure required variables are set
if (!MONGO_URI || !JWT_SECRET) {
  throw new Error("❌ Missing environment variables: MONGO_URI or JWT_SECRET");
}
