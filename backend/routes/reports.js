const express = require('express');
const router = express.Router();
const {
  generateSystemReport,
  exportEventsCSV,
  getAttendanceReports
} = require('../controllers/reportsController');
const { protect, adminOnly } = require('../utils/auth');

router.get('/system', protect, adminOnly, generateSystemReport);
router.get('/export-events', protect, adminOnly, exportEventsCSV);
router.get('/attendance', protect, adminOnly, getAttendanceReports);

module.exports = router;