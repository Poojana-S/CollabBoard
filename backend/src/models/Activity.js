import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

activitySchema.index({
  project: 1,
  timestamp: -1
});

activitySchema.index({
  user: 1,
  timestamp: -1
});

const Activity = mongoose.model(
  "Activity",
  activitySchema
);

export default Activity;