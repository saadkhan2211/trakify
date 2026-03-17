import Project from "../models/Project.js";
import { emitActivity } from "../utils/emitActivity.js";

export const getProjects = async (req, res) => {
  try {
    res.json(await Project.find().populate("department", "name"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProject = async (req, res) => {
  const { name, description, department } = req.body;
  if (!name?.trim())
    return res.status(400).json({ message: "Project name required." });
  try {
    const project = await Project.create({ name, description, department });
    emitActivity(req, "project", `Project "${name}" was created`);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!project)
      return res.status(404).json({ message: "Project not found." });
    emitActivity(req, "project", `Project "${project.name}" was updated`);
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project)
      return res.status(404).json({ message: "Project not found." });
    emitActivity(req, "project", `Project "${project.name}" was deleted`);
    res.json({ message: "Project deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
