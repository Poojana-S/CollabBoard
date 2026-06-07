import Comment from "../models/Comment.js";
import Task from "../models/Task.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import { createActivity } from "../services/activityService.js";

import { ACTIVITY_ACTIONS } from "../config/activityActions.js";

/**
 * POST /api/comments
 */

export const createComment =
  asyncHandler(async (req, res) => {
    const { task, content } =
      req.body;

    const taskDoc =
      await Task.findById(task);

    if (!taskDoc) {
      throw new ApiError(
        404,
        "Task not found"
      );
    }

    const comment =
      await Comment.create({
        task,
        content,
        user: req.user._id
      });

    await createActivity({
      action:
        ACTIVITY_ACTIONS.COMMENT_CREATED,
      user: req.user._id,
      task: taskDoc._id,
      project: taskDoc.project,
      metadata: {
        commentId: comment._id
      }
    });

    const populated =
      await Comment.findById(
        comment._id
      )
        .populate(
          "user",
          "name email avatar"
        )
        .populate(
          "task",
          "title"
        );

    res.status(201).json({
      success: true,
      message:
        "Comment created successfully",
      data: populated
    });
  });

/**
 * GET /api/comments/task/:taskId
 */

export const getTaskComments =
  asyncHandler(async (req, res) => {
    const comments =
      await Comment.find({
        task: req.params.taskId
      })
        .populate(
          "user",
          "name email avatar"
        )
        .sort({
          createdAt: 1
        });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  });

/**
 * PUT /api/comments/:id
 */

export const updateComment =
  asyncHandler(async (req, res) => {
    const comment =
      await Comment.findById(
        req.params.id
      );

    if (!comment) {
      throw new ApiError(
        404,
        "Comment not found"
      );
    }

    if (
      comment.user.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        "You can only edit your own comments"
      );
    }

    comment.content =
      req.body.content;

    comment.isEdited = true;

    comment.editedAt = new Date();

    await comment.save();

    const task =
      await Task.findById(
        comment.task
      );

    await createActivity({
      action:
        ACTIVITY_ACTIONS.COMMENT_UPDATED,
      user: req.user._id,
      task: task._id,
      project: task.project,
      metadata: {
        commentId: comment._id
      }
    });

    res.status(200).json({
      success: true,
      message:
        "Comment updated successfully",
      data: comment
    });
  });

/**
 * DELETE /api/comments/:id
 */

export const deleteComment =
  asyncHandler(async (req, res) => {
    const comment =
      await Comment.findById(
        req.params.id
      );

    if (!comment) {
      throw new ApiError(
        404,
        "Comment not found"
      );
    }

    if (
      comment.user.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        "You can only delete your own comments"
      );
    }

    const task =
      await Task.findById(
        comment.task
      );

    await createActivity({
      action:
        ACTIVITY_ACTIONS.COMMENT_DELETED,
      user: req.user._id,
      task: task._id,
      project: task.project,
      metadata: {
        commentId: comment._id
      }
    });

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Comment deleted successfully"
    });
  });