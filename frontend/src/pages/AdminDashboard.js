import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  Container,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Snackbar,
  Typography,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  AdminPanelSettings as AdminIcon,
  School as TeacherIcon,
  Person as StudentIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import UserManagement from '../components/admin/UserManagement';
import EventManagement from '../components/admin/EventManagement';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import ReportsDashboard from '../components/admin/ReportsDashboard';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../api/adminApi';

// StatCard Component with Urban Theme
const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ 
    height: '100%',
    background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
    border: '1px solid #333',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.2)',
      borderColor: '#FF6B35'
    }
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ color: '#b0b0b0', mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#666' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ 
          color: '#FF6B35', 
          fontSize: 40,
          background: 'rgba(255, 107, 53, 0.1)',
          borderRadius: '50%',
          p: 1
        }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Dashboard Content Component
const DashboardContent = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await adminApi.getDashboardStats();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
      // Fallback data
      setDashboardData({
        overview: {
          totalUsers: 0,
          totalEvents: 0,
          totalAdmins: 0,
          totalTeachers: 0,
          totalStudents: 0,
          eventsToday: 0,
          newUsersToday: 0
        },
        eventStatus: {
          upcoming: 0,
          ongoing: 0,
          completed: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress sx={{ color: '#FF6B35' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ 
        background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
        border: '1px solid #333',
        color: 'white',
        mb: 2
      }}>
        {error}
      </Alert>
    );
  }

  if (!dashboardData) {
    return (
      <Alert severity="info" sx={{ 
        background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
        border: '1px solid #333',
        color: 'white'
      }}>
        No dashboard data available.
      </Alert>
    );
  }

  const { overview, eventStatus } = dashboardData;

  return (
    <Box sx={{ backgroundColor: '#0a0a0a', minHeight: '100vh', p: 0 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: 'white',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
          Welcome to the admin dashboard. Here's an overview of your system.
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={overview.totalUsers}
            icon={<PeopleIcon />}
            subtitle={`${overview.newUsersToday} new today`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Events"
            value={overview.totalEvents}
            icon={<EventIcon />}
            subtitle={`${overview.eventsToday} today`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Admins"
            value={overview.totalAdmins}
            icon={<AdminIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Teachers"
            value={overview.totalTeachers}
            icon={<TeacherIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Students"
            value={overview.totalStudents}
            icon={<StudentIcon />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Event Status
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #333' }}>
                <Typography sx={{ color: '#b0b0b0' }}>Upcoming Events</Typography>
                <Typography fontWeight="bold" sx={{ color: '#FF6B35' }}>{eventStatus.upcoming}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #333' }}>
                <Typography sx={{ color: '#b0b0b0' }}>Ongoing Events</Typography>
                <Typography fontWeight="bold" sx={{ color: '#4CAF50' }}>{eventStatus.ongoing}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#b0b0b0' }}>Completed Events</Typography>
                <Typography fontWeight="bold" sx={{ color: 'white' }}>{eventStatus.completed}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Quick Actions
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                • Manage users and permissions
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                • View and edit events
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                • Generate reports and analytics
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                • Monitor system health
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'users':
        return <UserManagement onShowSnackbar={showSnackbar} />;
      case 'events':
        return <EventManagement onShowSnackbar={showSnackbar} />;
      case 'analytics':
        return <AnalyticsDashboard onShowSnackbar={showSnackbar} />;
      case 'reports':
        return <ReportsDashboard onShowSnackbar={showSnackbar} />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#0a0a0a'
    }}>
      <CssBaseline />
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
      
      <AdminHeader onMenuClick={handleDrawerToggle} />
      
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: '100vh',
          overflow: 'auto',
          p: 0,
          m: 0,
          mt: '64px',
          pt: 2
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            p: 3,
            width: '100%',
            maxWidth: '100% !important',
            m: 0,
            flex: 1
          }}
        >
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;