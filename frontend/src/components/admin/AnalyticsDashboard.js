import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Event as EventIcon,
  CalendarToday as CalendarIcon,
  BarChart as ChartIcon
} from '@mui/icons-material';
import { adminApi } from '../../api/adminApi';
import UrbanButton from '../common/UrbanButton';
import { UrbanOutlineButton } from '../common/UrbanOutlineButton';

const AnalyticsDashboard = ({ onShowSnackbar }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let dashboardData, eventStatsData, eventAnalyticsData;

      try {
        const dashboardRes = await adminApi.getDashboardStats();
        dashboardData = dashboardRes.data;
      } catch (err) {
        console.warn('Failed to fetch dashboard stats:', err);
        dashboardData = generateFallbackDashboardData();
      }

      try {
        const eventStatsRes = await adminApi.getEventStats();
        eventStatsData = eventStatsRes.data;
      } catch (err) {
        console.warn('Failed to fetch event stats:', err);
        eventStatsData = generateFallbackEventStats();
      }

      try {
        const eventAnalyticsRes = await adminApi.getEventAnalytics(30);
        eventAnalyticsData = eventAnalyticsRes.data;
      } catch (err) {
        console.warn('Failed to fetch event analytics, using fallback:', err);
        eventAnalyticsData = generateFallbackEventAnalytics();
        onShowSnackbar('Using fallback data for event analytics', 'warning');
      }

      setAnalyticsData({
        dashboard: dashboardData,
        eventAnalytics: eventAnalyticsData,
        eventStats: eventStatsData
      });

    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      const errorMessage = 'Failed to load analytics data. Using demo data.';
      setError(errorMessage);
      setAnalyticsData(generateFallbackData());
      onShowSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fallback data generators
  // const generateFallbackDashboardData = () => ({
  //   overview: {
  //     totalUsers: 156,
  //     totalEvents: 42,
  //     totalAdmins: 3,
  //     totalTeachers: 18,
  //     totalStudents: 135,
  //     eventsToday: 2,
  //     newUsersToday: 5
  //   },
  //   eventStatus: {
  //     upcoming: 15,
  //     ongoing: 3,
  //     completed: 24
  //   }
  // });

  // const generateFallbackEventStats = () => ({
  //   totalEvents: 42,
  //   eventsByStatus: [
  //     { _id: 'upcoming', count: 15 },
  //     { _id: 'ongoing', count: 3 },
  //     { _id: 'completed', count: 24 }
  //   ],
  //   eventsByMonth: [
  //     { _id: { year: 2024, month: 1 }, count: 8, totalAttendees: 240 },
  //     { _id: { year: 2024, month: 2 }, count: 12, totalAttendees: 365 }
  //   ],
  //   topEvents: [
  //     { _id: '1', title: 'Science Fair', attendeesCount: 120, startTime: '2024-02-15', venue: 'Main Hall' },
  //     { _id: '2', title: 'Sports Day', attendeesCount: 200, startTime: '2024-02-10', venue: 'Sports Ground' },
  //     { _id: '3', title: 'Math Workshop', attendeesCount: 85, startTime: '2024-02-05', venue: 'Room 101' }
  //   ]
  // });

  // const generateFallbackEventAnalytics = () => ({
  //   events: [
  //     { _id: '1', title: 'Math Workshop', attendeesCount: 45, capacity: 50, status: 'completed', startTime: '2024-02-01' },
  //     { _id: '2', title: 'Science Fair', attendeesCount: 120, capacity: 150, status: 'completed', startTime: '2024-02-15' },
  //     { _id: '3', title: 'Sports Day', attendeesCount: 200, capacity: 200, status: 'completed', startTime: '2024-02-10' },
  //     { _id: '4', title: 'Art Exhibition', attendeesCount: 75, capacity: 100, status: 'completed', startTime: '2024-02-08' },
  //     { _id: '5', title: 'Music Concert', attendeesCount: 180, capacity: 200, status: 'completed', startTime: '2024-02-12' }
  //   ],
  //   participation: [
  //     { _id: 'student', count: 135, totalEventsAttended: 450, avgEventsPerUser: 3.3 },
  //     { _id: 'teacher', count: 18, totalEventsAttended: 90, avgEventsPerUser: 5.0 },
  //     { _id: 'admin', count: 3, totalEventsAttended: 15, avgEventsPerUser: 5.0 }
  //   ],
  //   monthlyStats: [
  //     { _id: { year: 2024, month: 1 }, count: 8, totalAttendees: 240 },
  //     { _id: { year: 2024, month: 2 }, count: 12, totalAttendees: 365 }
  //   ]
  // });

  // const generateFallbackData = () => ({
  //   dashboard: generateFallbackDashboardData(),
  //   eventAnalytics: generateFallbackEventAnalytics(),
  //   eventStats: generateFallbackEventStats()
  // });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'primary';
      case 'ongoing': return 'success';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'teacher': return 'primary';
      case 'student': return 'success';
      default: return 'default';
    }
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) return '0';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toFixed(1);
    return '0';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress sx={{ color: '#FF6B35' }} />
        <Typography variant="h6" sx={{ ml: 2, color: 'white' }}>
          Loading analytics data...
        </Typography>
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

  const { dashboard, eventAnalytics, eventStats } = analyticsData;

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
          Analytics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: '#b0b0b0' }}>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FF6B35' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF6B35' },
              }}
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
          <UrbanOutlineButton 
            startIcon={<RefreshIcon />}
            onClick={fetchAnalyticsData}
          >
            Refresh Data
          </UrbanOutlineButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ 
          mb: 2,
          background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
          border: '1px solid #FF6B35',
          color: 'white'
        }}>
          {error}
        </Alert>
      )}

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: '#b0b0b0', mb: 1 }}>
                    Total Users
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {dashboard.overview.totalUsers}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {dashboard.overview.newUsersToday} new today
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
            border: '1px solid #333'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: '#b0b0b0', mb: 1 }}>
                    Total Events
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {dashboard.overview.totalEvents}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {dashboard.overview.eventsToday} today
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
            border: '1px solid #333'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: '#b0b0b0', mb: 1 }}>
                    Active Events
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {dashboard.eventStatus.ongoing + dashboard.eventStatus.upcoming}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {dashboard.eventStatus.ongoing} ongoing
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ color: '#4CAF50', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: '#b0b0b0', mb: 1 }}>
                    Completed
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {dashboard.eventStatus.completed}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Past events
                  </Typography>
                </Box>
                <CalendarIcon sx={{ color: '#b0b0b0', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* User Participation */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                User Participation
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Role</TableCell>
                      <TableCell align="right" sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Users</TableCell>
                      <TableCell align="right" sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Avg Events/User</TableCell>
                      <TableCell align="right" sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Total Attendance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eventAnalytics.participation?.map((role) => (
                      <TableRow key={role._id}>
                        <TableCell>
                          <Chip 
                            label={role._id} 
                            size="small"
                            sx={{
                              backgroundColor: 
                                role._id === 'admin' ? 'rgba(244, 67, 54, 0.2)' :
                                role._id === 'teacher' ? 'rgba(255, 107, 53, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                              color: 
                                role._id === 'admin' ? '#f44336' :
                                role._id === 'teacher' ? '#FF6B35' : '#4CAF50'
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'white' }}>{role.count}</TableCell>
                        <TableCell align="right" sx={{ color: 'white' }}>
                          {formatNumber(role.avgEventsPerUser)}
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'white' }}>{role.totalEventsAttended || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {(!eventAnalytics.participation || eventAnalytics.participation.length === 0) && (
                <Typography sx={{ color: '#b0b0b0', textAlign: 'center', py: 3 }}>
                  No participation data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Event Status Breakdown */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Event Status Breakdown
              </Typography>
              {eventStats.eventsByStatus?.map((status) => (
                <Box key={status._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #333' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={status._id} 
                      size="small"
                      sx={{
                        backgroundColor: 
                          status._id === 'upcoming' ? 'rgba(255, 107, 53, 0.2)' :
                          status._id === 'ongoing' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(158, 158, 158, 0.2)',
                        color: 
                          status._id === 'upcoming' ? '#FF6B35' :
                          status._id === 'ongoing' ? '#4CAF50' : '#9e9e9e',
                        mr: 2
                      }}
                    />
                    <Typography sx={{ color: '#b0b0b0' }}>{status._id.charAt(0).toUpperCase() + status._id.slice(1)}</Typography>
                  </Box>
                  <Typography fontWeight="bold" sx={{ color: 'white' }}>{status.count}</Typography>
                </Box>
              ))}
              {(!eventStats.eventsByStatus || eventStats.eventsByStatus.length === 0) && (
                <Typography sx={{ color: '#b0b0b0', textAlign: 'center', py: 3 }}>
                  No event status data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Events Analytics */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Recent Events Analytics
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Event Title</TableCell>
                      <TableCell align="right" sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Attendees</TableCell>
                      <TableCell align="right" sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Capacity</TableCell>
                      <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eventAnalytics.events?.slice(0, 10).map((event) => (
                      <TableRow key={event._id}>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200, color: 'white' }}>
                            {event.title}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'white' }}>{event.attendeesCount || 0}</TableCell>
                        <TableCell align="right" sx={{ color: 'white' }}>{event.capacity || 'Unlimited'}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell sx={{ color: '#b0b0b0' }}>
                          {event.startTime ? new Date(event.startTime).toLocaleDateString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {(!eventAnalytics.events || eventAnalytics.events.length === 0) && (
                <Typography sx={{ color: '#b0b0b0', textAlign: 'center', py: 3 }}>
                  No event data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Statistics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Monthly Statistics
              </Typography>
              {eventAnalytics.monthlyStats?.map((month) => (
                <Box key={`${month._id.year}-${month._id.month}`} sx={{ 
                  mb: 2, 
                  p: 2, 
                  background: 'linear-gradient(145deg, #232323, #1e1e1e)',
                  borderRadius: 1,
                  border: '1px solid #333'
                }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'white' }}>
                    {new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>{month.count} events</Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#FF6B35' }}>
                      {month.totalAttendees} attendees
                    </Typography>
                  </Box>
                </Box>
              ))}
              {(!eventAnalytics.monthlyStats || eventAnalytics.monthlyStats.length === 0) && (
                <Typography sx={{ color: '#b0b0b0', textAlign: 'center', py: 3 }}>
                  No monthly data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Events */}
        <Grid item xs={12}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Top Events by Attendance
              </Typography>
              <Grid container spacing={2}>
                {eventStats.topEvents?.map((event, index) => (
                  <Grid item xs={12} sm={6} md={4} key={event._id || index}>
                    <Paper sx={{ 
                      p: 2, 
                      background: 'linear-gradient(145deg, #232323, #1e1e1e)',
                      border: '1px solid #333'
                    }}>
                      <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ color: 'white' }}>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        {event.venue}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                          {event.attendeesCount || 0} attendees
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FF6B35' }}>
                          {event.capacity ? Math.round(((event.attendeesCount || 0) / event.capacity) * 100) : 100}%
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {event.startTime ? new Date(event.startTime).toLocaleDateString() : 'Date not available'}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              {(!eventStats.topEvents || eventStats.topEvents.length === 0) && (
                <Typography sx={{ color: '#b0b0b0', textAlign: 'center', py: 3 }}>
                  No top events data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;