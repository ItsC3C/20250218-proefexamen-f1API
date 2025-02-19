import express from "express";
import { notFound } from "../controllers/notfoundController";

const router = express.Router();

// Route for undefined paths
router.all("*", notFound);

export default router;
