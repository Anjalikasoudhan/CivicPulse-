import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Roads",
        "Garbage",
        "Water",
        "Electricity",
        "Drainage",
        "Other"
      ]
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending"
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;