// controllers/eventManagementController.js
const Event = require('../models/Event');
const User = require('../models/User');

// Get all events with filtering and pagination
exports.getAllEvents = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search, 
      sortBy = 'datetime',
      sortOrder = 'asc' 
    } = req.query;

    const filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(filter);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Delete event and remove from users' eventsAttended
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Find the event first
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Remove event from all users' eventsAttended
    await User.updateMany(
      { eventsAttended: eventId },
      { $pull: { eventsAttended: eventId } }
    );

    // Delete the event
    await Event.findByIdAndDelete(eventId);

    res.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Get event statistics
exports.getEventStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const eventsByStatus = await Event.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const eventsByMonth = await Event.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$datetime' },
            month: { $month: '$datetime' }
          },
          count: { $sum: 1 },
          totalAttendees: { $sum: { $size: '$attendees' } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    const topEvents = await Event.find()
      .populate('attendees')
      .sort({ 'attendees': -1 })
      .limit(5)
      .select('title attendeesCount datetime venue');

    res.json({
      totalEvents,
      eventsByStatus,
      eventsByMonth,
      topEvents
    });
  } catch (error) {
    console.error('Event stats error:', error);
    res.status(500).json({ error: 'Failed to fetch event statistics' });
  }
};