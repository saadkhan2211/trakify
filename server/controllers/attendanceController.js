import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import mongoose from "mongoose";

export const getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find().populate("employee");
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch attendance records." });
  }
};

export const createAttendance = async (req, res) => {
  try {
    let { employee, employeeName, date, status } = req.body;

    if (!employee && !employeeName) {
      return res
        .status(400)
        .json({ message: "Employee ID or Name is required." });
    }

    if (!employee && employeeName) {
      const foundEmployee = await Employee.findOne({ name: employeeName });
      if (!foundEmployee) {
        return res
          .status(404)
          .json({ message: `Employee '${employeeName}' not found.` });
      }
      employee = foundEmployee._id;
    }

    if (!date || !status) {
      return res
        .status(400)
        .json({ message: "Date and Status are required fields." });
    }

    const newAttendance = await Attendance.create({ employee, date, status });
    const populated = await Attendance.findById(newAttendance._id).populate(
      "employee"
    );

    return res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating attendance:", error);
    return res
      .status(500)
      .json({ message: "Failed to create attendance record." });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attendance ID." });
    }

    const updated = await Attendance.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("employee");

    if (!updated) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating attendance:", error);
    return res
      .status(500)
      .json({ message: "Failed to update attendance record." });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attendance ID." });
    }

    const deleted = await Attendance.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    return res
      .status(200)
      .json({ message: "Attendance record deleted successfully." });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete attendance record." });
  }
};
