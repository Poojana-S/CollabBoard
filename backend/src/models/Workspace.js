import mongoose from "mongoose";

const workspaceSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true
      },

      description: {
        type: String,
        default: ""
      },

      owner: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      members: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ]
    },
    {
      timestamps: true
    }
  );

workspaceSchema.index({
  owner: 1
});

workspaceSchema.index({
  members: 1
});

const Workspace = mongoose.model(
  "Workspace",
  workspaceSchema
);

export default Workspace;