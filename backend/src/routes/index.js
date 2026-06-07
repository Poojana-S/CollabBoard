import { Router } from "express";

import authRoutes from "./authRoutes.js";
import workspaceRoutes from "./workspaceRoutes.js";

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

export default router;