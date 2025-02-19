import express from "express";
import cors from "cors";
import connectToDb from "./config/database";
import raceRoutes from "./routes/raceRoutes";
import teamRoutes from "./routes/teamRoutes";
import driverRoutes from "./routes/driverRoutes";
import circuitRoutes from "./routes/circuitRoutes";
import notFoundRoutes from "./routes/notfoundRoutes";
import { NODE_ENV, PORT } from "./config/env";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/races", raceRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/circuits", circuitRoutes);
app.use(notFoundRoutes); // This handles routes that don't match any of the above

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT} 🚀 (${NODE_ENV})`);
  await connectToDb();
});
