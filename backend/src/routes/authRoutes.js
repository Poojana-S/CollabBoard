import { Router } from "express";

import {
  register,
  login,
  getCurrentUser,
  logout
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

import validateRequest from "../middleware/validateRequest.js";

import {
  registerValidator,
  loginValidator
} from "../validators/authValidators.js";

const router = Router();

/*
POST /api/auth/register
*/

router.post(
  "/register",
  registerValidator,
  validateRequest,
  register
);

/*
POST /api/auth/login
*/

router.post(
  "/login",
  loginValidator,
  validateRequest,
  login
);

/*
GET /api/auth/me
*/

router.get(
  "/me",
  protect,
  getCurrentUser
);

/*
POST /api/auth/logout
*/

router.post(
  "/logout",
  protect,
  logout
);

export default router;