import express from "express";
import { Driver } from "../models/driverModel";
import { createDriver, getDrivers } from "../controllers/driverController";

const router = express.Router();

// Get all drivers
router.get("/", getDrivers);

// Create a driver
router.post("/", createDriver);

export default router;
