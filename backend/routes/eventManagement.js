// routes/eventManagement.js
const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  deleteEvent,
  updateEvent,
  getEventStats
} = require('../controllers/eventManagementController');
const { protect, adminOnly } = require('../utils/auth');

router.get('/', protect, adminOnly, getAllEvents);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.get('/stats', protect, adminOnly, getEventStats);

module.exports = router;