const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const projectController = require('../controllers/projectController');

// Protect all project routes
router.use(protect);

router.get('/', projectController.getProjects);

// Admin only route
router.post('/', restrictTo('Admin'), projectController.createProject);

module.exports = router;
