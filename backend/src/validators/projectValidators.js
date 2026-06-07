import { body } from "express-validator";

export const createProjectValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage(
      "Project title is required"
    )
    .isLength({
      min: 3,
      max: 150
    })
    .withMessage(
      "Project title must be between 3 and 150 characters"
    ),

  body("workspace")
    .notEmpty()
    .withMessage(
      "Workspace ID is required"
    ),

  body("description")
    .optional()
    .isString()
    .withMessage(
      "Description must be text"
    ),

  body("members")
    .optional()
    .isArray()
    .withMessage(
      "Members must be an array"
    )
];

export const updateProjectValidator = [
  body("title")
    .optional()
    .isString()
    .withMessage(
      "Title must be text"
    ),

  body("description")
    .optional()
    .isString()
    .withMessage(
      "Description must be text"
    ),

  body("members")
    .optional()
    .isArray()
    .withMessage(
      "Members must be an array"
    )
];