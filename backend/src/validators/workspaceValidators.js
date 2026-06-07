import { body } from "express-validator";

export const createWorkspaceValidator =
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage(
        "Workspace name is required"
      )
      .isLength({
        min: 3,
        max: 100
      })
      .withMessage(
        "Workspace name must be between 3 and 100 characters"
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

export const updateWorkspaceValidator =
  [
    body("name")
      .optional()
      .isString()
      .withMessage(
        "Name must be text"
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