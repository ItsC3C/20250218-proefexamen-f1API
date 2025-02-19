import express from "express";
import { createTeam, getTeams } from "../controllers/teamController";

const router = express.Router();

// Get all teams
router.get("/", getTeams);

// Create a team
router.post("/", createTeam);

export default router;
