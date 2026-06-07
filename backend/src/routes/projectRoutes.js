import { Router } from "express";

import protect from "../middleware/authMiddleware.js";

import validateRequest from "../middleware/validateRequest.js";

import {
  createProjectValidator,
  updateProjectValidator
} from "../validators/projectValidators.js";

import {
  createProject,
  getProjectsByWorkspace,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";

const router = Router();

router.use(protect);

/**
 * POST /api/projects
 */

router.post(
  "/",
  createProjectValidator,
  validateRequest,
  createProject
);

/**
 * GET /api/projects/workspace/:workspaceId
 */

router.get(
  "/workspace/:workspaceId",
  getProjectsByWorkspace
);

/**
 * PUT /api/projects/:id
 */

router.put(
  "/:id",
  updateProjectValidator,
  validateRequest,
  updateProject
);

/**
 * DELETE /api/projects/:id
 */

router.delete(
  "/:id",
  deleteProject
);

export default router;