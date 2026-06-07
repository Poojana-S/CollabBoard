import Activity from "../models/Activity.js";
import Project from "../models/Project.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * GET /api/activities/project/:projectId
 */

export const getProjectActivity =
  asyncHandler(async (req, res) => {
    const project =
      await Project.findById(
        req.params.projectId
      );

    if (!project) {
      throw new ApiError(
        404,
        "Project not found"
      );
    }

    const activities =
      await Activity.find({
        project:
          req.params.projectId
      })
        .populate(
          "user",
          "name email avatar"
        )
        .populate(
          "task",
          "title status"
        )
        .sort({
          timestamp: -1
        });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  });

/**
 * GET /api/activities/user/me
 */

export const getMyActivities =
  asyncHandler(async (req, res) => {
    const activities =
      await Activity.find({
        user: req.user._id
      })
        .populate(
          "project",
          "title"
        )
        .populate(
          "task",
          "title"
        )
        .sort({
          timestamp: -1
        })
        .limit(50);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  });