import Workspace from "../models/Workspace.js";

const workspaceOwner =
  async (req, res, next) => {
    const workspace =
      await Workspace.findById(
        req.params.id
      );

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message:
          "Workspace not found"
      });
    }

    if (
      workspace.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only workspace owner can perform this action"
      });
    }

    req.workspace = workspace;

    next();
  };

export default workspaceOwner;