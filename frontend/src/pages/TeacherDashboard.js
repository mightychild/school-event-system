import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  Container,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import TeacherHeader from '../components/teacher/TeacherHeader';
import TeacherSidebar from '../components/teacher/TeacherSidebar';
import TeacherDashboard from '../components/teacher/TeacherDashboard';
import TeacherEvents from '../components/teacher/TeacherEvents';
import TeacherAnalytics from '../components/teacher/TeacherAnalytics';
import TeacherAttendees from '../components/teacher/TeacherAttendees';
import { useAuth } from '../context/AuthContext';
import { teacherApi } from '../api/teacherApi';

const TeacherDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [teacherStats, setTeacherStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  const fetchTeacherStats = async () => {
    try {
      setLoading(true);
      const { data } = await teacherApi.getDashboard();
      setTeacherStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch teacher stats:', error);
      // Use fallback stats if API fails
      setTeacherStats({
        totalEvents: 0,
        upcoming: 0,
        ongoing: 0,
        completed: 0,
        totalAttendees: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherStats();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TeacherDashboard onRefresh={fetchTeacherStats} />;
      case 'events':
        return <TeacherEvents onShowSnackbar={showSnackbar} />;
      case 'analytics':
        return <TeacherAnalytics onShowSnackbar={showSnackbar} />;
      case 'attendees':
        return <TeacherAttendees onShowSnackbar={showSnackbar} />;
      default:
        return <TeacherDashboard onRefresh={fetchTeacherStats} />;
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
      
      <TeacherHeader onMenuClick={handleDrawerToggle} />
      
      <TeacherSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        stats={teacherStats}
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
          // ml: { md: '280px' },
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
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
              <CircularProgress />
            </Box>
          ) : (
            renderContent()
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default TeacherDashboardPage;