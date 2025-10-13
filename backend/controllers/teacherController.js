// controllers/teacherController.js - Fixed version
const Event = require('../models/Event');
const User = require('../models/User');

exports.getTeacherDashboardData = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Get all teacher events for stats
    const events = await Event.find({ createdBy: teacherId });
    
    // Calculate comprehensive stats
    const stats = {
      totalEvents: events.length,
      upcoming: events.filter(e => e.status === 'upcoming').length,
      ongoing: events.filter(e => e.status === 'ongoing').length,
      completed: events.filter(e => e.status === 'completed').length,
      totalAttendees: events.reduce((sum, event) => sum + event.attendees.length, 0)
    };

    // Get recent events (last 5)
    const recentEvents = await Event.find({ createdBy: teacherId })
      .populate('attendees', 'name email')
      .sort({ startTime: -1 })
      .limit(5)
      .select('title startTime endTime venue status attendees');

    // Calculate analytics
    const analytics = {
      avgAttendance: stats.totalEvents > 0 
        ? Math.round((stats.totalAttendees / stats.totalEvents) * 100) / 100 
        : 0,
      eventsThisMonth: events.filter(e => {
        const eventDate = new Date(e.startTime);
        const now = new Date();
        return eventDate.getMonth() === now.getMonth() && 
               eventDate.getFullYear() === now.getFullYear();
      }).length,
      totalCapacityUsed: stats.totalAttendees
    };

    res.json({
      success: true,
      stats,
      recentEvents,
      analytics,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch dashboard data' 
    });
  }
};

// Get teacher's own events with proper filtering
exports.getTeacherEvents = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { status, page = 1, limit = 10, populate = 'true' } = req.query;

    console.log('Teacher ID:', teacherId);
    console.log('Query params:', { status, page, limit });

    // Build filter - ONLY show events created by this teacher
    const filter = { createdBy: teacherId };
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Create base query
    let query = Event.find(filter);

    // Populate if requested
    if (populate === 'true') {
      query = query.populate('attendees', 'name email');
    }

    // Execute query with pagination
    const events = await query
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Event.countDocuments(filter);

    // Get comprehensive teacher stats
    const allTeacherEvents = await Event.find({ createdBy: teacherId });
    
    const teacherStats = {
      totalEvents: total,
      upcoming: allTeacherEvents.filter(e => e.status === 'upcoming').length,
      ongoing: allTeacherEvents.filter(e => e.status === 'ongoing').length,
      completed: allTeacherEvents.filter(e => e.status === 'completed').length,
      totalAttendees: allTeacherEvents.reduce((sum, event) => sum + event.attendees.length, 0)
    };

    console.log(`Found ${events.length} events for teacher ${teacherId}`);

    res.json({
      success: true,
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      stats: teacherStats
    });

  } catch (error) {
    console.error('Teacher events error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch teacher events' 
    });
  }
};

// Export attendees for a specific event
exports.exportEventAttendees = async (req, res) => {
  try {
    const eventId = req.params.id;
    const teacherId = req.user._id;

    // Verify the event belongs to the teacher
    const event = await Event.findOne({ 
      _id: eventId, 
      createdBy: teacherId 
    }).populate('attendees', 'name email role');

    if (!event) {
      return res.status(404).json({ 
        success: false,
        error: 'Event not found or access denied' 
      });
    }

    // Prepare CSV data
    const csvData = event.attendees.map((attendee, index) => ({
      no: index + 1,
      name: attendee.name,
      email: attendee.email,
      role: attendee.role
    }));

    res.json({
      success: true,
      event: {
        title: event.title,
        startTime: event.startTime,
        venue: event.venue,
        totalAttendees: event.attendees.length
      },
      attendees: csvData
    });

  } catch (error) {
    console.error('Export attendees error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to export attendees' 
    });
  }
};

exports.getEventAnalytics = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Fetch all events created by this teacher
    const events = await Event.find({ createdBy: teacherId });

    // Aggregate analytics data
    const totalEvents = events.length;
    const totalAttendees = events.reduce((sum, event) => sum + event.attendees.length, 0);
    const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
    const ongoingEvents = events.filter(e => e.status === 'ongoing').length;
    const completedEvents = events.filter(e => e.status === 'completed').length;

    res.json({
      success: true,
      analytics: {
        totalEvents,
        totalAttendees,
        upcomingEvents,
        ongoingEvents,
        completedEvents
      }
    });

  } catch (error) {
    console.error('Event analytics error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch event analytics' 
    });
  }
};

exports.getEventAttendees = async (req, res) => {
  try {
    const eventId = req.params.id;
    const teacherId = req.user._id;

    // Verify the event belongs to the teacher
    const event = await Event.findOne({ 
      _id: eventId, 
      createdBy: teacherId 
    }).populate('attendees', 'name email role');

    if (!event) {
      return res.status(404).json({ 
        success: false,
        error: 'Event not found or access denied' 
      });
    }

    res.json({
      success: true,
      attendees: event.attendees
    });

  } catch (error) {
    console.error('Get attendees error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch attendees' 
    });
  }
};