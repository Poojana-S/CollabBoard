import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200
    },

    description: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo"
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },

    dueDate: {
      type: Date,
      default: null
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    labels: [
      {
        type: String,
        trim: true
      }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

taskSchema.index({
  project: 1,
  status: 1
});

taskSchema.index({
  assignee: 1
});

const Task = mongoose.model(
  "Task",
  taskSchema
);

export default Task;