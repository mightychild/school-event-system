import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Event as EventIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  BarChart as ChartIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart, 
  Pie,
  Cell,
  ResponsiveContainer 
} from 'recharts';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../../api/axios';

const localizer = momentLocalizer(moment);

const Analytics = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const [events, setEvents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [participationData, setParticipationData] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Color scheme for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch events data
      const eventsRes = await api.get('/events');
      setEvents(eventsRes.data);
      
      // Format for calendar
      const formattedEvents = eventsRes.data.map(event => ({
        id: event._id,
        title: event.title,
        start: new Date(event.datetime),
        end: new Date(new Date(event.datetime).setHours(new Date(event.datetime).getHours() + 2)),
        status: event.status
      }));
      setCalendarEvents(formattedEvents);

      // Mock attendance data (replace with actual API call)
      const mockAttendance = [
        { name: 'Orientation', attendees: 120, capacity: 150 },
        { name: 'Workshop', attendees: 85, capacity: 100 },
        { name: 'Seminar', attendees: 200, capacity: 250 },
        { name: 'Sports Day', attendees: 300, capacity: 350 },
      ];
      setAttendanceData(mockAttendance);

      // Mock participation data (replace with actual API call)
      const mockParticipation = [
        { name: 'Students', value: 65 },
        { name: 'Teachers', value: 20 },
        { name: 'Staff', value: 10 },
        { name: 'Parents', value: 5 },
      ];
      setParticipationData(mockParticipation);

    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.status) {
      case 'completed':
        backgroundColor = '#4CAF50'; // Green
        break;
      case 'ongoing':
        backgroundColor = '#2196F3'; // Blue
        break;
      case 'cancelled':
        backgroundColor = '#F44336'; // Red
        break;
      default:
        backgroundColor = '#FFC107'; // Yellow (upcoming)
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Analytics Dashboard</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="quarter">Last Quarter</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Event Attendance" icon={<EventIcon />} />
        <Tab label="Participation Metrics" icon={<PeopleIcon />} />
        <Tab label="Event Calendar" icon={<CalendarIcon />} />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Event Attendance vs Capacity
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={attendanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendees" fill="#8884d8" name="Attendees" />
                  <Bar dataKey="capacity" fill="#82ca9d" name="Capacity" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Attendance Rate
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={attendanceData.map(event => ({
                      name: event.name,
                      value: Math.round((event.attendees / event.capacity) * 100)
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                User Participation Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={participationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {participationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Top Participating Users
              </Typography>
              <Box sx={{ height: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  (Would display user leaderboard with actual data)
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Paper sx={{ p: 2, height: 600 }}>
          <Typography variant="h6" gutterBottom>
            Event Calendar View
          </Typography>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day', 'agenda']}
            defaultView="month"
            onSelectEvent={(event) => console.log('Event selected:', event)}
          />
        </Paper>
      )}
    </Paper>
  );
};

export default Analytics;