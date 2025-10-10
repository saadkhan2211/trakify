import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["Present", "Absent"], default: "Present" },
});

export default mongoose.model("Attendance", attendanceSchema);
