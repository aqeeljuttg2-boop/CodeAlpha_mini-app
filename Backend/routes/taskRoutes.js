const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Get all tasks for a project
router.get("/project/:projectId", auth, getTasksByProject);

// Get single task
router.get("/:id", auth, getTaskById);

// Create new task
router.post("/", auth, createTask);

// Update task
router.put("/:id", auth, updateTask);

// Delete task
router.delete("/:id", auth, deleteTask);

module.exports = router;
