const express = require('express');
const router = express.Router();
const { getDashboardStats, getEventAnalytics } = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../utils/auth');

router.get('/dashboard-stats', protect, adminOnly, getDashboardStats);
router.get('/event-analytics', protect, adminOnly, getEventAnalytics);

module.exports = router;