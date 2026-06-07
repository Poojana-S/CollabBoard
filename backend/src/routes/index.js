import { Router } from "express";

import authRoutes from "./authRoutes.js";
import workspaceRoutes from "./workspaceRoutes.js";
import projectRoutes from "./projectRoutes.js";
import taskRoutes from "./taskRoutes.js";
import commentRoutes from "./commentRoutes.js";
import activityRoutes from "./activityRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CollabBoard API Running"
  });
});

router.use("/auth", authRoutes);

router.use(
  "/workspaces",
  workspaceRoutes
);

router.use(
  "/projects",
  projectRoutes
);

router.use(
  "/tasks",
  taskRoutes
);

router.use(
  "/comments",
  commentRoutes
);

router.use(
  "/activities",
  activityRoutes
);

router.use(
  "/dashboard",
  dashboardRoutes
);

export default router;