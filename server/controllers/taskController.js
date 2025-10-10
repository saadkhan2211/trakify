import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  const data = await Task.find().populate("assignedTo").populate("project");
  res.json(data);
};

export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(task);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};
