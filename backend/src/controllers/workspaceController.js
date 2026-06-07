import Workspace from "../models/Workspace.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc Create Workspace
 * @route POST /api/workspaces
 * @access Private
 */
export const createWorkspace = asyncHandler(
  async (req, res) => {
    const { name, description, members } =
      req.body;

    const workspace =
      await Workspace.create({
        name,
        description,
        owner: req.user._id,
        members: [
          req.user._id,
          ...(members || [])
        ]
      });

    const populated =
      await Workspace.findById(
        workspace._id
      )
        .populate(
          "owner",
          "name email avatar"
        )
        .populate(
          "members",
          "name email avatar"
        );

    res.status(201).json({
      success: true,
      message:
        "Workspace created successfully",
      data: populated
    });
  }
);

/**
 * @desc Get User Workspaces
 * @route GET /api/workspaces
 * @access Private
 */
export const getUserWorkspaces =
  asyncHandler(async (req, res) => {
    const workspaces =
      await Workspace.find({
        members: req.user._id
      })
        .populate(
          "owner",
          "name email avatar"
        )
        .sort({
          createdAt: -1
        });

    res.status(200).json({
      success: true,
      count: workspaces.length,
      data: workspaces
    });
  });

/**
 * @desc Get Workspace By ID
 * @route GET /api/workspaces/:id
 * @access Private (Member Only)
 */
export const getWorkspaceById =
  asyncHandler(async (req, res) => {
    const workspace =
      await Workspace.findById(
        req.params.id
      )
        .populate(
          "owner",
          "name email avatar"
        )
        .populate(
          "members",
          "name email avatar"
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
          member._id.toString() ===
          req.user._id.toString()
      );

    if (!isMember) {
      throw new ApiError(
        403,
        "You do not have access to this workspace"
      );
    }

    res.status(200).json({
      success: true,
      data: workspace
    });
  });

/**
 * @desc Update Workspace
 * @route PUT /api/workspaces/:id
 * @access Owner Only
 */
export const updateWorkspace =
  asyncHandler(async (req, res) => {
    const workspace =
      await Workspace.findById(
        req.params.id
      );

    if (!workspace) {
      throw new ApiError(
        404,
        "Workspace not found"
      );
    }

    if (
      workspace.owner.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        "Only workspace owner can update workspace"
      );
    }

    workspace.name =
      req.body.name || workspace.name;

    workspace.description =
      req.body.description ??
      workspace.description;

    if (
      req.body.members &&
      Array.isArray(req.body.members)
    ) {
      workspace.members =
        req.body.members;
    }

    const updated =
      await workspace.save();

    const populated =
      await Workspace.findById(
        updated._id
      )
        .populate(
          "owner",
          "name email avatar"
        )
        .populate(
          "members",
          "name email avatar"
        );

    res.status(200).json({
      success: true,
      message:
        "Workspace updated successfully",
      data: populated
    });
  });

/**
 * @desc Delete Workspace
 * @route DELETE /api/workspaces/:id
 * @access Owner Only
 */
export const deleteWorkspace =
  asyncHandler(async (req, res) => {
    const workspace =
      await Workspace.findById(
        req.params.id
      );

    if (!workspace) {
      throw new ApiError(
        404,
        "Workspace not found"
      );
    }

    if (
      workspace.owner.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        "Only workspace owner can delete workspace"
      );
    }

    await workspace.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Workspace deleted successfully"
    });
  });