const Event = require('../models/Event');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    console.log('Fetching dashboard stats...');
    
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const eventsToday = await Event.countDocuments({
      startTime: { $gte: today, $lt: tomorrow }
    });

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Get event status counts
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const ongoingEvents = await Event.countDocuments({ status: 'ongoing' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });

    console.log('Dashboard stats fetched successfully');

    res.json({
      overview: {
        totalUsers,
        totalEvents,
        totalAdmins,
        totalTeachers,
        totalStudents,
        eventsToday,
        newUsersToday
      },
      eventStatus: {
        upcoming: upcomingEvents,
        ongoing: ongoingEvents,
        completed: completedEvents
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics data',
      details: error.message 
    });
  }
};

exports.getEventAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    console.log('Fetching event analytics for days:', days);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Use simple queries instead of complex aggregation to avoid errors
    // Get events with manual counts
    const events = await Event.find({
      startTime: { $gte: startDate }
    })
    .select('title attendees capacity status startTime createdBy')
    .populate('createdBy', 'name')
    .sort({ startTime: -1 })
    .lean();

    const eventsWithCounts = events.map(event => ({
      _id: event._id,
      title: event.title,
      attendeesCount: event.attendees ? event.attendees.length : 0,
      capacity: event.capacity,
      status: event.status,
      startTime: event.startTime,
      createdBy: event.createdBy
    }));

    // Get user participation data
    const users = await User.find().select('role eventsAttended').lean();
    
    const participationMap = {};
    users.forEach(user => {
      if (!participationMap[user.role]) {
        participationMap[user.role] = {
          count: 0,
          totalEventsAttended: 0
        };
      }
      participationMap[user.role].count++;
      participationMap[user.role].totalEventsAttended += user.eventsAttended ? user.eventsAttended.length : 0;
    });

    const participation = Object.keys(participationMap).map(role => ({
      _id: role,
      count: participationMap[role].count,
      totalEventsAttended: participationMap[role].totalEventsAttended,
      avgEventsPerUser: participationMap[role].count > 0 
        ? (participationMap[role].totalEventsAttended / participationMap[role].count).toFixed(1)
        : 0
    }));

    // Get monthly stats
    const monthlyEvents = await Event.find({
      createdAt: { $gte: startDate }
    }).select('createdAt attendees').lean();

    const monthlyStatsMap = {};
    monthlyEvents.forEach(event => {
      const date = new Date(event.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyStatsMap[key]) {
        monthlyStatsMap[key] = {
          count: 0,
          totalAttendees: 0,
          year: date.getFullYear(),
          month: date.getMonth() + 1
        };
      }
      
      monthlyStatsMap[key].count++;
      monthlyStatsMap[key].totalAttendees += event.attendees ? event.attendees.length : 0;
    });

    const monthlyStats = Object.values(monthlyStatsMap)
      .sort((a, b) => a.year === b.year ? a.month - b.month : a.year - b.year)
      .map(item => ({
        _id: { year: item.year, month: item.month },
        count: item.count,
        totalAttendees: item.totalAttendees
      }));

    console.log('Event analytics fetched successfully');

    res.json({
      events: eventsWithCounts,
      participation,
      monthlyStats
    });

  } catch (error) {
    console.error('Event analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch event analytics',
      details: error.message
    });
  }
};