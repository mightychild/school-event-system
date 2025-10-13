import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Event as EventIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { teacherApi } from '../../api/teacherApi';
import UrbanButton from '../common/UrbanButton';
import { UrbanOutlineButton } from '../common/UrbanOutlineButton';

const TeacherAnalytics = ({ onShowSnackbar }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await teacherApi.getAnalytics();
      
      if (data.success) {
        setAnalyticsData(data);
      } else {
        throw new Error(data.error || 'Failed to fetch analytics data');
      }
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load analytics');
      // Use fallback data
      // setAnalyticsData({
      //   analytics: {
      //     totalEvents: 12,
      //     totalAttendees: 145,
      //     upcomingEvents: 3,
      //     ongoingEvents: 1,
      //     completedEvents: 8,
      //     avgAttendance: 75,
      //     eventsThisMonth: 2
      //   }
      // });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'primary';
      case 'ongoing': return 'success';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress sx={{ color: '#FF6B35' }} />
        <Typography variant="h6" sx={{ ml: 2, color: 'white' }}>
          Loading analytics...
        </Typography>
      </Box>
    );
  }

  if (error) {
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
          onClick={fetchAnalyticsData}
        >
          Retry
        </UrbanButton>
      </Box>
    );
  }

  if (!analyticsData) {
    return (
      <Alert severity="info" sx={{ 
        background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
        border: '1px solid #333',
        color: 'white'
      }}>
        No analytics data available.
      </Alert>
    );
  }

  const { analytics } = analyticsData;

  return (
    <Box sx={{ backgroundColor: '#0a0a0a', minHeight: '100vh', p: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ 
          color: 'white',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Teacher Analytics
        </Typography>
        <UrbanOutlineButton 
          startIcon={<RefreshIcon />}
          onClick={fetchAnalyticsData}
        >
          Refresh
        </UrbanOutlineButton>
      </Box>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: '#b0b0b0', mb: 1 }}>
                    Total Events
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {analytics.totalEvents}
                  </Typography>
                </Box>
                <EventIcon sx={{ color: '#FF6B35', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: '#b0b0b0', mb: 1 }}>
                    Total Attendees
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {analytics.totalAttendees}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ color: '#FF6B35', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: '#b0b0b0', mb: 1 }}>
                    Avg Attendance
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#FF6B35' }}>
                    {analytics.avgAttendance}%
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ color: '#FF6B35', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: '#b0b0b0', mb: 1 }}>
                    This Month
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {analytics.eventsThisMonth}
                  </Typography>
                </Box>
                <CalendarIcon sx={{ color: '#FF6B35', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Event Status Breakdown */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333',
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Event Status Breakdown
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #333' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="Upcoming" 
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255, 107, 53, 0.2)',
                      color: '#FF6B35',
                      mr: 2
                    }}
                  />
                  <Typography sx={{ color: '#b0b0b0' }}>Upcoming Events</Typography>
                </Box>
                <Typography fontWeight="bold" sx={{ color: 'white' }}>{analytics.upcomingEvents}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #333' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="Ongoing" 
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      color: '#4CAF50',
                      mr: 2
                    }}
                  />
                  <Typography sx={{ color: '#b0b0b0' }}>Ongoing Events</Typography>
                </Box>
                <Typography fontWeight="bold" sx={{ color: 'white' }}>{analytics.ongoingEvents}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="Completed" 
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(158, 158, 158, 0.2)',
                      color: '#9e9e9e',
                      mr: 2
                    }}
                  />
                  <Typography sx={{ color: '#b0b0b0' }}>Completed Events</Typography>
                </Box>
                <Typography fontWeight="bold" sx={{ color: 'white' }}>{analytics.completedEvents}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333',
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Performance Metrics
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #333' }}>
                <Typography sx={{ color: '#b0b0b0' }}>Attendance Rate</Typography>
                <Typography fontWeight="bold" sx={{ color: '#FF6B35' }}>
                  {analytics.avgAttendance}%
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #333' }}>
                <Typography sx={{ color: '#b0b0b0' }}>Events This Month</Typography>
                <Typography fontWeight="bold" sx={{ color: 'white' }}>{analytics.eventsThisMonth}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#b0b0b0' }}>Total Capacity Used</Typography>
                <Typography fontWeight="bold" sx={{ color: 'white' }}>{analytics.totalAttendees}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ 
        mt: 3,
        background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
        border: '1px solid #333',
        color: 'white'
      }}>
        <Typography variant="body2">
          Analytics data provides insights into your event performance and audience engagement.
        </Typography>
      </Alert>
    </Box>
  );
};

export default TeacherAnalytics;