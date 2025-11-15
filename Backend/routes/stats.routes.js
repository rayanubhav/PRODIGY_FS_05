import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getStats } from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/counts", protectRoute, getStats);

export default router;