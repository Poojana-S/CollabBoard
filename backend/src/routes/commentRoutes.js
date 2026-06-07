import { Router } from "express";

import protect from "../middleware/authMiddleware.js";

import validateRequest from "../middleware/validateRequest.js";

import {
  createCommentValidator,
  updateCommentValidator
} from "../validators/commentValidators.js";

import {
  createComment,
  getTaskComments,
  updateComment,
  deleteComment
} from "../controllers/commentController.js";

const router = Router();

router.use(protect);

router.post(
  "/",
  createCommentValidator,
  validateRequest,
  createComment
);

router.get(
  "/task/:taskId",
  getTaskComments
);

router.put(
  "/:id",
  updateCommentValidator,
  validateRequest,
  updateComment
);

router.delete(
  "/:id",
  deleteComment
);

export default router;