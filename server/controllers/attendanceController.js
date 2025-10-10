import Attendance from "../models/Attendance.js";

export const getAttendance = async (req, res) => {
  const data = await Attendance.find().populate("employee");
  res.json(data);
};

export const createAttendance = async (req, res) => {
  const att = await Attendance.create(req.body);
  res.json(att);
};

export const updateAttendance = async (req, res) => {
  const att = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(att);
};

export const deleteAttendance = async (req, res) => {
  await Attendance.findByIdAndDelete(req.params.id);
  res.json({ message: "Attendance record deleted" });
};
