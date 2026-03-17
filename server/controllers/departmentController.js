import Department from "../models/Department.js";
import { emitActivity } from "../utils/emitActivity.js";

export const getDepartments = async (req, res) => {
  try {
    res.json(await Department.find().sort({ name: 1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createDepartment = async (req, res) => {
  const { name } = req.body;
  if (!name?.trim())
    return res.status(400).json({ message: "Department name required." });
  try {
    const exists = await Department.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (exists)
      return res.status(409).json({ message: "Department already exists." });
    const dept = await Department.create({ name });
    emitActivity(req, "department", `Department "${name}" was created`);
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!dept)
      return res.status(404).json({ message: "Department not found." });
    emitActivity(req, "department", `Department renamed to "${dept.name}"`);
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept)
      return res.status(404).json({ message: "Department not found." });
    emitActivity(req, "department", `Department "${dept.name}" was deleted`);
    res.json({ message: "Department deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
