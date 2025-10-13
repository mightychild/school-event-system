import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  AdminPanelSettings as AdminIcon,
  School as TeacherIcon,
  Person as StudentIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ color: color, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  // Sample data for testing
  const stats = {
    overview: {
      totalUsers: 156,
      totalEvents: 42,
      totalAdmins: 3,
      totalTeachers: 18,
      totalStudents: 135,
      eventsToday: 2,
      newUsersToday: 5
    },
    eventStatus: {
      upcoming: 15,
      ongoing: 3,
      completed: 24
    }
  };

  const { overview, eventStatus } = stats;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome to the admin dashboard. Here's an overview of your system.
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={overview.totalUsers}
            icon={<PeopleIcon fontSize="inherit" />}
            color="#1976d2"
            subtitle={`${overview.newUsersToday} new today`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Events"
            value={overview.totalEvents}
            icon={<EventIcon fontSize="inherit" />}
            color="#2e7d32"
            subtitle={`${overview.eventsToday} today`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Admins"
            value={overview.totalAdmins}
            icon={<AdminIcon fontSize="inherit" />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Teachers"
            value={overview.totalTeachers}
            icon={<TeacherIcon fontSize="inherit" />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Students"
            value={overview.totalStudents}
            icon={<StudentIcon fontSize="inherit" />}
            color="#0288d1"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Status
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Upcoming Events</Typography>
                <Typography fontWeight="bold" color="primary">{eventStatus.upcoming}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Ongoing Events</Typography>
                <Typography fontWeight="bold" color="success.main">{eventStatus.ongoing}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Completed Events</Typography>
                <Typography fontWeight="bold">{eventStatus.completed}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Manage users and permissions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • View and edit events
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Generate reports and analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Monitor system health
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;