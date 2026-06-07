import Workspace from "../models/Workspace.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";

import asyncHandler from "../utils/asyncHandler.js";

/**
 * GET /api/dashboard/stats
 * Dashboard Analytics
 */

export const getDashboardStats =
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    /**
     * Workspaces where user is a member
     */

    const workspaceIds =
      await Workspace.find({
        members: userId
      }).distinct("_id");

    /**
     * Projects inside user workspaces
     */

    const projectIds =
      await Project.find({
        workspace: {
          $in: workspaceIds
        }
      }).distinct("_id");

    /**
     * Total Counts
     */

    const [
      totalWorkspaces,
      totalProjects,
      totalTasks
    ] = await Promise.all([
      Workspace.countDocuments({
        _id: {
          $in: workspaceIds
        }
      }),

      Project.countDocuments({
        _id: {
          $in: projectIds
        }
      }),

      Task.countDocuments({
        project: {
          $in: projectIds
        }
      })
    ]);

    /**
     * Tasks By Status
     */

    const tasksByStatus =
      await Task.aggregate([
        {
          $match: {
            project: {
              $in: projectIds
            }
          }
        },
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1
            }
          }
        }
      ]);

    /**
     * Tasks By Priority
     */

    const tasksByPriority =
      await Task.aggregate([
        {
          $match: {
            project: {
              $in: projectIds
            }
          }
        },
        {
          $group: {
            _id: "$priority",
            count: {
              $sum: 1
            }
          }
        }
      ]);

    /**
     * Upcoming Deadlines
     */

    const upcomingDeadlines =
      await Task.find({
        project: {
          $in: projectIds
        },
        dueDate: {
          $ne: null,
          $gte: new Date()
        }
      })
        .populate(
          "assignee",
          "name email avatar"
        )
        .populate(
          "project",
          "title"
        )
        .sort({
          dueDate: 1
        })
        .limit(10);

    /**
     * Recent Activities
     */

    const recentActivities =
      await Activity.find({
        project: {
          $in: projectIds
        }
      })
        .populate(
          "user",
          "name email avatar"
        )
        .populate(
          "task",
          "title status"
        )
        .populate(
          "project",
          "title"
        )
        .sort({
          timestamp: -1
        })
        .limit(20);

    /**
     * Overdue Tasks
     */

    const overdueTasks =
      await Task.find({
        project: {
          $in: projectIds
        },
        status: {
          $ne: "Done"
        },
        dueDate: {
          $lt: new Date()
        }
      })
        .populate(
          "project",
          "title"
        )
        .populate(
          "assignee",
          "name email avatar"
        )
        .sort({
          dueDate: 1
        });

    /**
     * Assigned To Me
     */

    const assignedToMe =
      await Task.countDocuments({
        assignee: userId
      });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalWorkspaces,
          totalProjects,
          totalTasks,
          assignedToMe
        },

        tasksByStatus,

        tasksByPriority,

        upcomingDeadlines,

        overdueTasks,

        recentActivities
      }
    });
  });