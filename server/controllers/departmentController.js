import Department from "../models/Department.js";

export const getDepartments = async (req, res) => {
  const data = await Department.find();
  res.json(data);
};

export const createDepartment = async (req, res) => {
  const dept = await Department.create(req.body);
  res.json(dept);
};

export const updateDepartment = async (req, res) => {
  const dept = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(dept);
};

export const deleteDepartment = async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ message: "Department deleted" });
};
