import express from "express";
import { getRaces } from "../controllers/raceController";

const router = express.Router();

// Get all races
router.get("/", getRaces);

export default router;
