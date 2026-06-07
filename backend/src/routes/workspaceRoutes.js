import { Router } from "express";

import protect from "../middleware/authMiddleware.js";

import validateRequest from "../middleware/validateRequest.js";

import {
  createWorkspaceValidator,
  updateWorkspaceValidator
} from "../validators/workspaceValidators.js";

import {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace
} from "../controllers/workspaceController.js";

const router = Router();

router.use(protect);

router.post(
  "/",
  createWorkspaceValidator,
  validateRequest,
  createWorkspace
);

router.get(
  "/",
  getUserWorkspaces
);

router.get(
  "/:id",
  getWorkspaceById
);

router.put(
  "/:id",
  updateWorkspaceValidator,
  validateRequest,
  updateWorkspace
);

router.delete(
  "/:id",
  deleteWorkspace
);

export default router;