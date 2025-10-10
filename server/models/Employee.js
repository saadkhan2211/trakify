import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
});

export default mongoose.model("Employee", employeeSchema);
