import Project from "../models/Project.js";
import Workspace from "../models/Workspace.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import { createActivity } from "../services/activityService.js";
import { ACTIVITY_ACTIONS } from "../config/activityActions.js";

/**
 * POST /api/projects
 */
export const createProject = asyncHandler(
  async (req, res) => {
    const {
      title,
      description,
      workspace,
      members
    } = req.body;

    const workspaceDoc =
      await Workspace.findById(workspace);

    if (!workspaceDoc) {
      throw new ApiError(
        404,
        "Workspace not found"
      );
    }

    const isMember =
      workspaceDoc.members.some(
        (member) =>
          member.toString() ===
          req.user._id.toString()
      );

    if (!isMember) {
      throw new ApiError(
        403,
        "You are not a workspace member"
      );
    }

    const project =
      await Project.create({
        title,
        description,
        workspace,
        members: [
          req.user._id,
          ...(members || [])
        ],
        createdBy: req.user._id
      });

    await createActivity({
      action:
        ACTIVITY_ACTIONS.PROJECT_CREATED,
      user: req.user._id,
      project: project._id,
      metadata: {
        title: project.title
      }
    });

    const populated =
      await Project.findById(project._id)
        .populate("workspace", "name")
        .populate(
          "createdBy",
          "name email avatar"
        )
        .populate(
          "members",
          "name email avatar"
        );

    res.status(201).json({
      success: true,
      message:
        "Project created successfully",
      data: populated
    });
  }
);

/**
 * GET /api/projects/workspace/:workspaceId
 */
export const getProjectsByWorkspace =
  asyncHandler(async (req, res) => {
    const workspace =
      await Workspace.findById(
        req.params.workspaceId
      );

    if (!workspace) {
      throw new ApiError(
        404,
        "Workspace not found"
      );
    }

    const isMember =
      workspace.members.some(
        (member) =>
          member.toString() ===
          req.user._id.toString()
      );

    if (!isMember) {
      throw new ApiError(
        403,
        "Access denied"
      );
    }

    const projects =
      await Project.find({
        workspace:
          req.params.workspaceId
      })
        .populate(
          "workspace",
          "name"
        )
        .populate(
          "createdBy",
          "name email avatar"
        )
        .populate(
          "members",
          "name email avatar"
        )
        .sort({
          createdAt: -1
        });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  });

/**
 * PUT /api/projects/:id
 */
export const updateProject =
  asyncHandler(async (req, res) => {
    const project =
      await Project.findById(
        req.params.id
      );

    if (!project) {
      throw new ApiError(
        404,
        "Project not found"
      );
    }

    const workspace =
      await Workspace.findById(
        project.workspace
      );

    if (
      workspace.owner.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        "Only workspace owner can update projects"
      );
    }

    project.title =
      req.body.title ||
      project.title;

    project.description =
      req.body.description ??
      project.description;

    if (
      req.body.members &&
      Array.isArray(req.body.members)
    ) {
      project.members =
        req.body.members;
    }

    await project.save();

    await createActivity({
      action:
        ACTIVITY_ACTIONS.PROJECT_UPDATED,
      user: req.user._id,
      project: project._id,
      metadata: {
        title: project.title
      }
    });

    const populated =
      await Project.findById(
        project._id
      )
        .populate(
          "workspace",
          "name"
        )
        .populate(
          "createdBy",
          "name email avatar"
        )
        .populate(
          "members",
          "name email avatar"
        );

    res.status(200).json({
      success: true,
      message:
        "Project updated successfully",
      data: populated
    });
  });

/**
 * DELETE /api/projects/:id
 */
export const deleteProject =
  asyncHandler(async (req, res) => {
    const project =
      await Project.findById(
        req.params.id
      );

    if (!project) {
      throw new ApiError(
        404,
        "Project not found"
      );
    }

    const workspace =
      await Workspace.findById(
        project.workspace
      );

    if (
      workspace.owner.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        "Only workspace owner can delete projects"
      );
    }

    await createActivity({
      action:
        ACTIVITY_ACTIONS.PROJECT_DELETED,
      user: req.user._id,
      project: project._id,
      metadata: {
        title: project.title
      }
    });

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Project deleted successfully"
    });
  });