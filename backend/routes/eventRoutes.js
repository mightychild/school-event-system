const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getTeacherEvents
} = require('../controllers/eventController');
const { protect } = require('../utils/auth');

router.route('/')
  .post(protect, createEvent)
  .get(protect, getEvents);

router.route('/:id')
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

router.post('/:id/register', protect, registerForEvent);
router.post('/:id/unregister', protect, unregisterFromEvent);

router.get('/teacher', protect, getTeacherEvents);
router.get('/', protect, getEvents);

module.exports = router;

