import { body } from "express-validator";

export const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage(
      "Task title is required"
    )
    .isLength({
      min: 3,
      max: 200
    }),

  body("project")
    .notEmpty()
    .withMessage(
      "Project ID is required"
    ),

  body("status")
    .optional()
    .isIn([
      "Todo",
      "In Progress",
      "Done"
    ])
    .withMessage(
      "Invalid task status"
    ),

  body("priority")
    .optional()
    .isIn([
      "Low",
      "Medium",
      "High"
    ])
    .withMessage(
      "Invalid task priority"
    ),

  body("labels")
    .optional()
    .isArray()
    .withMessage(
      "Labels must be an array"
    )
];

export const updateTaskValidator = [
  body("title")
    .optional()
    .isString(),

  body("description")
    .optional()
    .isString(),

  body("status")
    .optional()
    .isIn([
      "Todo",
      "In Progress",
      "Done"
    ]),

  body("priority")
    .optional()
    .isIn([
      "Low",
      "Medium",
      "High"
    ]),

  body("labels")
    .optional()
    .isArray()
];

export const updateTaskStatusValidator =
  [
    body("status")
      .notEmpty()
      .isIn([
        "Todo",
        "In Progress",
        "Done"
      ])
      .withMessage(
        "Invalid task status"
      )
  ];