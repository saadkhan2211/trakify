import Project from "../models/Project.js";

export const getProjects = async (req, res) => {
  const data = await Project.find().populate("department");
  res.json(data);
};

export const createProject = async (req, res) => {
  const proj = await Project.create(req.body);
  res.json(proj);
};

export const updateProject = async (req, res) => {
  const proj = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(proj);
};

export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted" });
};
