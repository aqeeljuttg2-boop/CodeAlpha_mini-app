const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
} = require("../controllers/projectController");

// Get all projects for current user
router.get("/", auth, getProjects);

// Create project
router.post("/", auth, createProject);

// Get single project
router.get("/:id", auth, getProjectById);

// Update project
router.put("/:id", auth, updateProject);

// Delete project
router.delete("/:id", auth, deleteProject);

// Add member to project
router.post("/:id/members", auth, addMember);

module.exports = router;