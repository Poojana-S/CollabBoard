import { Router } from "express";

import authRoutes from "./authRoutes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CollabBoard API Running"
  });
});

router.use("/auth", authRoutes);

export default router;