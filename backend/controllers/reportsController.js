const Event = require('../models/Event');
const User = require('../models/User');

exports.generateSystemReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log('Generating system report:', { startDate, endDate });

    // Build date filter if provided
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // User statistics
    const totalUsers = await User.countDocuments(dateFilter);
    const usersByRole = await User.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Event statistics
    const totalEvents = await Event.countDocuments(dateFilter);
    const eventsByStatus = await Event.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAttendees: { $sum: { $size: '$attendees' } }
        }
      }
    ]);

    // Recent activities
    const recentEvents = await Event.find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('createdBy', 'name')
      .select('title startTime venue status attendees');

    const recentUsers = await User.find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role createdAt');

    console.log('System report generated successfully');

    res.json({
      reportPeriod: {
        startDate: startDate || 'Beginning',
        endDate: endDate || 'Present'
      },
      userStatistics: {
        totalUsers,
        usersByRole
      },
      eventStatistics: {
        totalEvents,
        eventsByStatus
      },
      recentActivities: {
        events: recentEvents,
        users: recentUsers
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('System report error:', error);
    res.status(500).json({ 
      error: 'Failed to generate system report',
      details: error.message
    });
  }
};

exports.exportEventsCSV = async (req, res) => {
  try {
    console.log('Exporting events to CSV...');

    const events = await Event.find()
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .sort({ startTime: -1 })
      .lean();

    const eventsData = events.map(event => ({
      title: event.title,
      description: event.description || '',
      startTime: event.startTime.toISOString(),
      endTime: event.endTime ? event.endTime.toISOString() : '',
      venue: event.venue,
      status: event.status,
      createdBy: event.createdBy?.name || 'N/A',
      attendeesCount: event.attendees ? event.attendees.length : 0,
      capacity: event.capacity || 'Unlimited',
      createdAt: event.createdAt.toISOString()
    }));

    console.log('Events CSV export successful');

    res.json(eventsData);

  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ 
      error: 'Failed to export events data',
      details: error.message
    });
  }
};

exports.getAttendanceReports = async (req, res) => {
  try {
    const { eventId, userId } = req.query;
    console.log('Generating attendance report:', { eventId, userId });

    let matchStage = {};
    if (eventId) matchStage._id = eventId;
    if (userId) matchStage.attendees = userId;

    const events = await Event.find(matchStage)
      .populate('attendees', 'name email role')
      .populate('createdBy', 'name')
      .sort({ startTime: -1 })
      .lean();

    const attendanceData = events.map(event => ({
      _id: event._id,
      title: event.title,
      startTime: event.startTime,
      venue: event.venue,
      status: event.status,
      attendeesCount: event.attendees ? event.attendees.length : 0,
      capacity: event.capacity,
      attendanceRate: event.capacity && event.capacity > 0 
        ? Math.round((event.attendees.length / event.capacity) * 100)
        : 100,
      createdBy: event.createdBy?.name,
      attendees: event.attendees ? event.attendees.map(attendee => ({
        name: attendee.name,
        email: attendee.email,
        role: attendee.role
      })) : []
    }));

    console.log('Attendance report generated successfully');

    res.json(attendanceData);

  } catch (error) {
    console.error('Attendance report error:', error);
    res.status(500).json({ 
      error: 'Failed to generate attendance report',
      details: error.message
    });
  }
};