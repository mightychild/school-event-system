const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Import models
const User = require('./models/User');
const Event = require('./models/Event');

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const teacherRoutes = require('./routes/teacher');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analytics');
const eventManagementRoutes = require('./routes/eventManagement');
const reportsRoutes = require('./routes/reports');

// Import controllers
const authController = require('./controllers/authController');
const eventController = require('./controllers/eventController');
const adminController = require('./controllers/adminController');

// Import middleware
const authMiddleware = require('./utils/auth');

// Import services
const EventStatusService = require('./services/EventStatusService');

// ===== ROUTE MOUNTING =====
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin/events', eventManagementRoutes);
app.use('/api/reports', reportsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check all routes
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  
  function processMiddleware(middleware, prefix = '') {
    if (middleware.route) {
      const path = prefix + middleware.route.path;
      routes.push({
        path: path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      const routerPrefix = prefix;
      middleware.handle.stack.forEach((handler) => {
        processMiddleware(handler, routerPrefix);
      });
    }
  }

  app._router.stack.forEach((middleware) => {
    processMiddleware(middleware);
  });

  res.json({ 
    message: 'Registered routes',
    routes: routes.sort((a, b) => a.path.localeCompare(b.path))
  });
});

// TEMPORARY ROUTES FOR TESTING
app.get('/api/analytics/dashboard-stats', authMiddleware.protect, authMiddleware.adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalStudents = await User.countDocuments({ role: 'student' });

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

    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const ongoingEvents = await Event.countDocuments({ status: 'ongoing' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });

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
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

app.get('/api/teacher/dashboard', authMiddleware.protect, async (req, res) => {
  try {
    const teacherId = req.user._id;
    
    const events = await Event.find({ createdBy: teacherId });
    
    const stats = {
      totalEvents: events.length,
      upcoming: events.filter(e => e.status === 'upcoming').length,
      ongoing: events.filter(e => e.status === 'ongoing').length,
      completed: events.filter(e => e.status === 'completed').length,
      totalAttendees: events.reduce((sum, event) => sum + event.attendees.length, 0)
    };

    const recentEvents = await Event.find({ createdBy: teacherId })
      .populate('attendees', 'name email')
      .sort({ startTime: -1 })
      .limit(5)
      .select('title startTime endTime venue status attendees');

    res.json({
      success: true,
      stats,
      recentEvents,
      analytics: {
        avgAttendance: stats.totalEvents > 0 ? Math.round(stats.totalAttendees / stats.totalEvents) : 0,
        eventsThisMonth: events.filter(e => {
          const eventDate = new Date(e.startTime);
          const now = new Date();
          return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
        }).length,
        totalCapacityUsed: stats.totalAttendees
      }
    });
  } catch (error) {
    console.error('Teacher dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to load dashboard' 
    });
  }
});

// Start event status service
EventStatusService.start();

// Error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found', 
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Debug routes: http://localhost:${PORT}/api/debug/routes`);
});