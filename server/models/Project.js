import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
});

export default mongoose.model("Project", projectSchema);
