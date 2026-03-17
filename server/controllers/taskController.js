import Task from "../models/Task.js";
import { emitActivity } from "../utils/emitActivity.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name")
      .populate("project", "name")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name")
      .populate("project", "name");
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    emitActivity(req, "task", `Task "${task.title}" was created`);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!task) return res.status(404).json({ message: "Task not found." });
    emitActivity(req, "task", `Task "${task.title}" was updated`);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const patchTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    if (!task) return res.status(404).json({ message: "Task not found." });
    if (req.body.status) {
      emitActivity(req, "task", `Task "${task.title}" moved to ${task.status}`);
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    emitActivity(req, "task", `Task "${task.title}" was deleted`);
    res.json({ message: "Task deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
