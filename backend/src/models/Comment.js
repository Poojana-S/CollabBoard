import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000
    },

    isEdited: {
      type: Boolean,
      default: false
    },

    editedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

commentSchema.index({
  task: 1,
  createdAt: -1
});

const Comment = mongoose.model(
  "Comment",
  commentSchema
);

export default Comment;