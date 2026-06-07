import Workspace from "../models/Workspace.js";

const workspaceAccess = async (
  req,
  res,
  next
) => {
  const workspaceId =
    req.body.workspace ||
    req.params.workspaceId;

  const workspace =
    await Workspace.findById(
      workspaceId
    );

  if (!workspace) {
    return res.status(404).json({
      success: false,
      message:
        "Workspace not found"
    });
  }

  const isMember =
    workspace.members.some(
      (member) =>
        member.toString() ===
        req.user._id.toString()
    );

  if (!isMember) {
    return res.status(403).json({
      success: false,
      message:
        "You do not have access to this workspace"
    });
  }

  req.workspace = workspace;

  next();
};

export default workspaceAccess;