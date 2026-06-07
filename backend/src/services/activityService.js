import Activity from "../models/Activity.js";

export const createActivity =
  async ({
    action,
    user,
    task = null,
    project = null,
    metadata = {}
  }) => {
    return await Activity.create({
      action,
      user,
      task,
      project,
      metadata
    });
  };

export const getProjectActivities =
  async (projectId) => {
    return await Activity.find({
      project: projectId
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
  };