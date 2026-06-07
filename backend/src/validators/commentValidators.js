import { body } from "express-validator";

export const createCommentValidator = [
  body("task")
    .notEmpty()
    .withMessage("Task ID is required"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({
      min: 1,
      max: 2000
    })
    .withMessage(
      "Comment must be between 1 and 2000 characters"
    )
];

export const updateCommentValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({
      min: 1,
      max: 2000
    })
];