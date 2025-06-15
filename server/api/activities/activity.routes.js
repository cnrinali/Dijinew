const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware');
const {
    getAdminActivities,
    getCorporateActivities,
    getRecentActivities,
    getActivityStats
} = require('./activity.controller');

// @route   GET /api/activities/admin
// @desc    Get all activities (admin only)
// @access  Private/Admin
router.get('/admin', protect, getAdminActivities);

// @route   GET /api/activities/corporate
// @desc    Get company activities (corporate only)
// @access  Private/Corporate
router.get('/corporate', protect, getCorporateActivities);

// @route   GET /api/activities/recent
// @desc    Get recent activities for dashboard
// @access  Private
router.get('/recent', protect, getRecentActivities);

// @route   GET /api/activities/stats
// @desc    Get activity statistics
// @access  Private
router.get('/stats', protect, getActivityStats);

module.exports = router; 