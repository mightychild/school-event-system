const express = require('express');
const router = express.Router();
const {
  getTeacherEvents,
  getEventAnalytics,
  getEventAttendees,
  exportEventAttendees,
  getTeacherDashboardData
} = require('../controllers/teacherController');
const { protect } = require('../utils/auth');

router.use(protect);

// Teacher dashboard endpoint
router.get('/dashboard', getTeacherDashboardData);

// Teacher events
router.get('/events', getTeacherEvents);

// Analytics
router.get('/analytics', getEventAnalytics);

// Attendees management
router.get('/events/:id/attendees', getEventAttendees);
router.get('/events/:id/export-attendees', exportEventAttendees);

module.exports = router;