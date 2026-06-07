import Task from "../models/Task.js";
import Project from "../models/Project.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import { createActivity } from "../services/activityService.js";

import { ACTIVITY_ACTIONS } from "../config/activityActions.js";

/**
 * Create Task
 * POST /api/tasks
 */

export const createTask =
  asyncHandler(async (req, res) => {
    const {
      title,
      description,
      project,
      assignee,
      dueDate,
      labels,
      priority,
      status
    } = req.body;

    const projectDoc =
      await Project.findById(project);

    if (!projectDoc) {
      throw new ApiError(
        404,
        "Project not found"
      );
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignee,
      dueDate,
      labels,
      priority,
      status,
      createdBy: req.user._id
    });

    await createActivity({
      action:
        ACTIVITY_ACTIONS.TASK_CREATED,
      user: req.user._id,
      task: task._id,
      project: projectDoc._id,
      metadata: {
        title: task.title
      }
    });

    const populated =
      await Task.findById(task._id)
        .populate(
          "assignee",
          "name email avatar"
        )
        .populate(
          "createdBy",
          "name email avatar"
        );

    res.status(201).json({
      success: true,
      message:
        "Task created successfully",
      data: populated
    });
  });

/**
 * Get Project Tasks
 * GET /api/tasks/project/:projectId
 */

export const getTasksByProject =
  asyncHandler(async (req, res) => {
    const tasks = await Task.find({
      project:
        req.params.projectId
    })
      .populate(
        "assignee",
        "name email avatar"
      )
      .populate(
        "createdBy",
        "name email avatar"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  });

/**
 * Update Task
 */

export const updateTask =
  asyncHandler(async (req, res) => {
    const task =
      await Task.findById(
        req.params.id
      );

    if (!task) {
      throw new ApiError(
        404,
        "Task not found"
      );
    }

    task.title =
      req.body.title || task.title;

    task.description =
      req.body.description ??
      task.description;

    task.priority =
      req.body.priority ||
      task.priority;

    task.status =
      req.body.status ||
      task.status;

    task.assignee =
      req.body.assignee ??
      task.assignee;

    task.labels =
      req.body.labels ||
      task.labels;

    task.dueDate =
      req.body.dueDate ??
      task.dueDate;

    await task.save();

    await createActivity({
      action:
        ACTIVITY_ACTIONS.TASK_UPDATED,
      user: req.user._id,
      task: task._id,
      project: task.project,
      metadata: {
        title: task.title
      }
    });

    res.status(200).json({
      success: true,
      message:
        "Task updated successfully",
      data: task
    });
  });

/**
 * Delete Task
 */

export const deleteTask =
  asyncHandler(async (req, res) => {
    const task =
      await Task.findById(
        req.params.id
      );

    if (!task) {
      throw new ApiError(
        404,
        "Task not found"
      );
    }

    await createActivity({
      action:
        ACTIVITY_ACTIONS.TASK_DELETED,
      user: req.user._id,
      task: task._id,
      project: task.project,
      metadata: {
        title: task.title
      }
    });

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Task deleted successfully"
    });
  });

/**
 * Kanban Move
 * PATCH /api/tasks/:id/status
 */

export const updateTaskStatus =
  asyncHandler(async (req, res) => {
    const task =
      await Task.findById(
        req.params.id
      );

    if (!task) {
      throw new ApiError(
        404,
        "Task not found"
      );
    }

    const oldStatus =
      task.status;

    task.status = req.body.status;

    await task.save();

    await createActivity({
      action:
        ACTIVITY_ACTIONS.TASK_STATUS_CHANGED,
      user: req.user._id,
      task: task._id,
      project: task.project,
      metadata: {
        oldStatus,
        newStatus:
          req.body.status
      }
    });

    res.status(200).json({
      success: true,
      message:
        "Task status updated",
      data: task
    });
  });