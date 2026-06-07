import { Router } from "express";

import protect from "../middleware/authMiddleware.js";

import validateRequest from "../middleware/validateRequest.js";

import {
  createTaskValidator,
  updateTaskValidator,
  updateTaskStatusValidator
} from "../validators/taskValidators.js";

import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  updateTaskStatus
} from "../controllers/taskController.js";

const router = Router();

router.use(protect);

router.post(
  "/",
  createTaskValidator,
  validateRequest,
  createTask
);

router.get(
  "/project/:projectId",
  getTasksByProject
);

router.put(
  "/:id",
  updateTaskValidator,
  validateRequest,
  updateTask
);

router.delete(
  "/:id",
  deleteTask
);

router.patch(
  "/:id/status",
  updateTaskStatusValidator,
  validateRequest,
  updateTaskStatus
);

export default router;