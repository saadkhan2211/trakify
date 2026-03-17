import Employee from "../models/Employee.js";
import { emitActivity } from "../utils/emitActivity.js";

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("department", "name");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "department",
      "name",
    );
    if (!employee)
      return res.status(404).json({ message: "Employee not found." });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createEmployee = async (req, res) => {
  const { name, email, position, department } = req.body;
  if (!name || !email)
    return res.status(400).json({ message: "Name and email required." });

  try {
    const exists = await Employee.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already registered." });

    const employee = await Employee.create({
      name,
      email,
      position,
      department,
    });
    emitActivity(
      req,
      "employee",
      `${name} was added as ${position || "employee"}`,
    );
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!employee)
      return res.status(404).json({ message: "Employee not found." });
    emitActivity(req, "employee", `${employee.name}'s profile was updated`);
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found." });
    emitActivity(req, "employee", `${employee.name} was removed`);
    res.json({ message: "Employee deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
