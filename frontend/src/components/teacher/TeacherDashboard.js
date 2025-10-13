import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Event as EventIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/format';
import { teacherApi } from '../../api/teacherApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UrbanButton from '../common/UrbanButton';
import { UrbanOutlineButton } from '../common/UrbanOutlineButton';

const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
  <Card 
    sx={{ 
      height: '100%', 
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
      border: '1px solid #333',
      '&:hover': onClick ? { 
        transform: 'translateY(-4px)', 
        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.2)',
        borderColor: '#FF6B35'
      } : {}
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ color: '#b0b0b0', mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold" sx={{ color: 'white' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#666' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ 
          bgcolor: 'rgba(255, 107, 53, 0.1)', 
          color: '#FF6B35',
          width: 48,
          height: 48
        }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch teacher dashboard data from backend
      const { data } = await teacherApi.getDashboard();
      
      if (data.success) {
        setDashboardData(data);
      } else {
        throw new Error(data.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load dashboard');
      
      // Fallback to sample data only if API fails completely
      // setDashboardData({
      //   stats: {
      //     totalEvents: 0,
      //     upcoming: 0,
      //     ongoing: 0,
      //     completed: 0,
      //     totalAttendees: 0
      //   },
      //   recentEvents: [],
      //   analytics: {
      //     avgAttendance: 0,
      //     eventsThisMonth: 0,
      //     totalCapacityUsed: 0
      //   }
      // });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateEvent = () => {
    navigate('/teacher/events');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress sx={{ color: '#FF6B35' }} />
        <Typography variant="h6" sx={{ ml: 2, color: 'white' }}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  if (error && !dashboardData) {
    return (
      <Box>
        <Alert severity="error" sx={{ 
          background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
          border: '1px solid #333',
          color: 'white',
          mb: 2
        }}>
          {error}
        </Alert>
        <UrbanButton 
          startIcon={<RefreshIcon />}
          onClick={fetchDashboardData}
        >
          Retry
        </UrbanButton>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Alert severity="info" sx={{ 
        background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
        border: '1px solid #333',
        color: 'white'
      }}>
        No dashboard data available. Create your first event to get started!
      </Alert>
    );
  }

  const { stats, recentEvents, analytics } = dashboardData;

  return (
    <Box sx={{ backgroundColor: '#0a0a0a', minHeight: '100vh', p: 0 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: 'white',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
          Here's what's happening with your events today.
        </Typography>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ 
          background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
          border: '1px solid #FF6B35',
          color: 'white',
          mb: 3
        }}>
          Using limited data. Some features may not be available.
        </Alert>
      )}

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            icon={<EventIcon />}
            color="#FF6B35"
            subtitle={`${stats.upcoming} upcoming`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Attendees"
            value={stats.totalAttendees}
            icon={<PeopleIcon />}
            color="#FF6B35"
            subtitle="Across all events"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ongoing Events"
            value={stats.ongoing}
            icon={<TrendingUpIcon />}
            color="#FF6B35"
            subtitle="Happening now"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CalendarIcon />}
            color="#FF6B35"
            subtitle="Past events"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Events */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>Recent Events</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <UrbanOutlineButton 
                    startIcon={<RefreshIcon />}
                    onClick={fetchDashboardData}
                    disabled={loading}
                  >
                    Refresh
                  </UrbanOutlineButton>
                  <UrbanButton 
                    startIcon={<AddIcon />}
                    onClick={handleCreateEvent}
                  >
                    Create Event
                  </UrbanButton>
                </Box>
              </Box>
              
              {recentEvents.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ color: '#b0b0b0', mb: 2 }}>
                    No events created yet.
                  </Typography>
                  <UrbanButton 
                    startIcon={<AddIcon />}
                    onClick={handleCreateEvent}
                  >
                    Create Your First Event
                  </UrbanButton>
                </Box>
              ) : (
                <List>
                  {recentEvents.map((event) => (
                    <ListItem key={event._id} divider sx={{ borderColor: '#333' }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: 'primary.main',
                          background: 'linear-gradient(45deg, #FF6B35, #FF8E53)'
                        }}>
                          <EventIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ color: 'white' }}>
                            {event.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                              {formatDateTime(event.startTime)} • {event.venue}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Chip 
                                label={event.status} 
                                size="small"
                                sx={{
                                  backgroundColor: 
                                    event.status === 'upcoming' ? 'rgba(255, 107, 53, 0.2)' :
                                    event.status === 'ongoing' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(158, 158, 158, 0.2)',
                                  color: 
                                    event.status === 'upcoming' ? '#FF6B35' :
                                    event.status === 'ongoing' ? '#4CAF50' : '#9e9e9e'
                                }}
                              />
                              <Chip 
                                label={`${event.attendees?.length || 0} attendees`}
                                variant="outlined"
                                size="small"
                                sx={{ 
                                  borderColor: '#444',
                                  color: '#b0b0b0'
                                }}
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Analytics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Quick Stats
              </Typography>
              <Box sx={{ spaceY: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: '1px solid #333' }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Avg. Attendance</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: '#FF6B35' }}>
                    {analytics.avgAttendance}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: '1px solid #333' }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Events This Month</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: 'white' }}>
                    {analytics.eventsThisMonth}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Total Capacity Used</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: 'white' }}>
                    {analytics.totalCapacityUsed}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherDashboard;