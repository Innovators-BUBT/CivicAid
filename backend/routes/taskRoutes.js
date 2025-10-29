const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getAvailableAssignees,
  assignTask,
  updateTaskProgress,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protected routes
router.get('/my-tasks', protect, getMyTasks);
router.get('/:id', protect, getTaskById);
router.put('/:id/progress', protect, updateTaskProgress);

// Admin routes
router.post('/', protect, admin, createTask);
router.get('/', protect, admin, getTasks);
router.get('/available-assignees', protect, admin, getAvailableAssignees);
router.put('/:id/assign', protect, admin, assignTask);
router.put('/:id', protect, admin, updateTask);
router.delete('/:id', protect, admin, deleteTask);
router.get('/stats', protect, admin, getTaskStats);

module.exports = router; 