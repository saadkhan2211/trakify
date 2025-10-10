import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
});

export default mongoose.model("Task", taskSchema);
