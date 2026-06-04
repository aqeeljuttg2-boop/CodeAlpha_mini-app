const Project = require("../models/Project");

// =========================
// CREATE PROJECT
// =========================
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// =========================
// GET ALL PROJECTS FOR CURRENT USER
// =========================
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.user.id }, { members: req.user.id }],
    })
      .populate("createdBy", "name username avatar")
      .populate("members", "name username avatar")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// =========================
// GET SINGLE PROJECT
// =========================
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name username avatar")
      .populate("members", "name username avatar");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// =========================
// UPDATE PROJECT
// =========================
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Only creator can update
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate("createdBy", "name username avatar")
      .populate("members", "name username avatar");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// =========================
// DELETE PROJECT
// =========================
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// =========================
// ADD MEMBER TO PROJECT
// =========================
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};