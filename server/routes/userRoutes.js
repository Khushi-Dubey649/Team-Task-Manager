const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect);

// Team management is restricted to Admins only
router.use(restrictTo('Admin')); 

router.get('/', userController.getAllUsers);

module.exports = router;
