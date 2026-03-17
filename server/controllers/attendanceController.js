import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import { emitActivity } from "../utils/emitActivity.js";

export const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("employee", "name")
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAttendance = async (req, res) => {
  let { employee, employeeName, status, date } = req.body;

  if (!employee && employeeName) {
    const found = await Employee.findOne({
      name: { $regex: `^${employeeName}$`, $options: "i" },
    });
    if (!found)
      return res
        .status(404)
        .json({ message: `Employee "${employeeName}" not found.` });
    employee = found._id;
  }

  if (!employee)
    return res.status(400).json({ message: "Employee ID or name required." });

  try {
    const record = await Attendance.create({
      employee,
      status: status || "Present",
      date: date || new Date(),
    });
    const populated = await record.populate("employee", "name");
    emitActivity(
      req,
      "attendance",
      `${populated.employee?.name || "Employee"} marked ${status || "Present"}`,
    );
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found." });
    res.json({ message: "Attendance record deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
