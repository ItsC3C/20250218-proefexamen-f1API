import express from "express";
import { createCircuit, getCircuits } from "../controllers/circuitController";

const router = express.Router();

// Get all circuits
router.get("/", getCircuits);

// Create a circuit
router.post("/", createCircuit);

export default router;
