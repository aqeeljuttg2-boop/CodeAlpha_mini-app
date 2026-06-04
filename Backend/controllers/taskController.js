const Task = require("../models/Task");

// =========================
// CREATE TASK
// =========================
exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, status, priority, dueDate } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: "Title and project are required" });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
      status: status || "Todo",
      priority: priority || "Medium",
      dueDate: dueDate || null,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// =========================
// GET ALL TASKS FOR A PROJECT
// =========================
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name username avatar")
      .populate("createdBy", "name username avatar")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// =========================
// GET SINGLE TASK
// =========================
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name username avatar")
      .populate("createdBy", "name username avatar")
      .populate("project", "title");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// =========================
// UPDATE TASK
// =========================
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate("assignedTo", "name username avatar")
      .populate("createdBy", "name username avatar");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// =========================
// DELETE TASK
// =========================
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    await Task.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
