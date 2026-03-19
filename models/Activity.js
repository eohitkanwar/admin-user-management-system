import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ["USER_CREATED", "USER_UPDATED", "USER_DELETED"]
    },
    description: {
      type: String,
      default: ""
    },

    // Kisne action kiya (Admin)
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Kis user pe action hua
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true } // createdAt auto aa jayega
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;