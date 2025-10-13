
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/format';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)` }}>
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
        <Avatar sx={{ bgcolor: `${color}30`, color: color }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const RecentActivityItem = ({ item, type }) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar sx={{ 
        bgcolor: type === 'event' ? 'primary.main' : 'secondary.main',
        width: 32,
        height: 32
      }}>
        {type === 'event' ? <EventIcon /> : <PersonIcon />}
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={item.title || item.name}
      secondary={
        type === 'event' 
          ? `${formatDateTime(item.datetime)} • ${item.attendees?.length || 0} attendees`
          : `${item.role} • Joined ${new Date(item.createdAt).toLocaleDateString()}`
      }
    />
  </ListItem>
);

const DashboardOverview = ({ stats, loading }) => {
  if (loading) {
    return <LinearProgress />;
  }

  if (!stats) {
    return <Typography>No data available</Typography>;
  }

  const { overview, eventStatus, recentActivities } = stats;

  return (
    <Box>
      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={overview.totalUsers}
            icon={<PeopleIcon />}
            color="#1976d2"
            subtitle={`${overview.newUsersToday} new today`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Events"
            value={overview.totalEvents}
            icon={<EventIcon />}
            color="#2e7d32"
            subtitle={`${overview.eventsToday} today`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Teachers"
            value={overview.totalTeachers}
            icon={<PersonIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Students"
            value={overview.totalStudents}
            icon={<GroupIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Event Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon color="primary" />
                Event Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary.main">
                      {eventStatus.upcoming}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upcoming
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {eventStatus.ongoing}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ongoing
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="text.secondary">
                      {eventStatus.completed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon color="primary" />
                Recent Activities
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                <List dense>
                  {recentActivities.events.slice(0, 3).map((event, index) => (
                    <RecentActivityItem key={index} item={event} type="event" />
                  ))}
                  {recentActivities.users.slice(0, 2).map((user, index) => (
                    <RecentActivityItem key={index} item={user} type="user" />
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;