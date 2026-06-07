import { Router } from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getProjectActivity,
  getMyActivities
} from "../controllers/activityController.js";

const router = Router();

router.use(protect);

router.get(
  "/project/:projectId",
  getProjectActivity
);

router.get(
  "/user/me",
  getMyActivities
);

export default router;