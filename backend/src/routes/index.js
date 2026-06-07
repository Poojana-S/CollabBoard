import { Router } from "express";

import authRoutes from "./authRoutes.js";
import workspaceRoutes from "./workspaceRoutes.js";
import projectRoutes from "./projectRoutes.js";

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

export default router;