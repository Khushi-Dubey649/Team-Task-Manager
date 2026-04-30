const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Protect all task routes
router.use(protect);

// Dashboards and general fetches
router.get('/overdue', taskController.getOverdueTasks);
router.get('/project/:projectId', taskController.getProjectTasks);

// Task operations
router.post('/', restrictTo('Admin'), taskController.createTask); // Only admins create
router.put('/:id/status', taskController.updateTaskStatus); // Status update (has internal RBAC)

module.exports = router;
