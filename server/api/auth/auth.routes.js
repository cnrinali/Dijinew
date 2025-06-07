const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/authMiddleware');
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    updateUserRole
} = require('./auth.controller');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot', forgotPassword);
router.put('/reset/:resetToken', resetPassword);

// Protected routes
router.post('/logout', protect, logoutUser);
router.put('/update-role', protect, authorize('admin'), updateUserRole);

module.exports = router; 