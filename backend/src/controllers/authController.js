import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const register = asyncHandler(
  async (req, res) => {
    const { name, email, password, avatar } =
      req.body;

    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "User already exists with this email"
      );
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      }
    });
  }
);

export const login = asyncHandler(
  async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      email
    });

    if (!user) {
      throw new ApiError(
        401,
        "Invalid email or password"
      );
    }

    const isMatch =
      await user.comparePassword(password);

    if (!isMatch) {
      throw new ApiError(
        401,
        "Invalid email or password"
      );
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      }
    });
  }
);

export const getCurrentUser =
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      data: req.user
    });
  });

export const logout = asyncHandler(
  async (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Logout successful. Remove token on client side."
    });
  }
);