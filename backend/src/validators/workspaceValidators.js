import { body } from "express-validator";

export const createWorkspaceValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Workspace name required"),

  body("description")
    .optional()
    .isString()
];

export const updateWorkspaceValidator = [
  body("name")
    .optional()
    .isString(),

  body("description")
    .optional()
    .isString()
];