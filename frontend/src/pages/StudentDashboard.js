import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  CssBaseline
} from '@mui/material';
import { Menu } from '@mui/icons-material';

// Components
import StudentHeader from '../components/student/StudentHeader';
import StudentSidebar from '../components/student/StudentSidebar';
import EnhancedEventFilters from '../components/student/EnhancedEventFilters';
import EventsGrid from '../components/student/EventsGrid';
import EventsCalendar from '../components/student/EventsCalendar';
import EventDetailModal from '../components/common/EventDetailModal';
import LoadingState from '../components/common/LoadingState';
import SkeletonLoader from '../components/common/SkeletonLoader';
import ErrorState from '../components/common/ErrorState';

// Hooks
import { useEvents, useEventRegistration } from '../hooks/useEvents';
import { useUser } from '../hooks/useUser';

const StudentDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // State
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Data Hooks
  const { events, loading, error, refetch, updateEventInState } = useEvents(statusFilter === 'all' ? '' : statusFilter);
  const { user, loading: userLoading } = useUser();
  const { registerForEvent, unregisterFromEvent } = useEventRegistration();

  // Filtered Events
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    
    return events.filter(event => {
      const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !dateFilter || 
                         (event.startTime && new Date(event.startTime).toDateString() === dateFilter.toDateString());
      
      return matchesSearch && matchesDate;
    });
  }, [events, searchTerm, dateFilter]);

  // Event Handlers
  const handleRegister = async (eventId) => {
    const result = await registerForEvent(eventId);
    if (result.success) {
      setSnackbar({ 
        open: true, 
        message: 'Successfully registered for event!', 
        severity: 'success' 
      });
      updateEventInState(result.event);
    } else {
      setSnackbar({ 
        open: true, 
        message: result.error || 'Registration failed!', 
        severity: 'error' 
      });
    }
  };

  const handleUnregister = async (eventId) => {
    const result = await unregisterFromEvent(eventId);
    if (result.success) {
      setSnackbar({ 
        open: true, 
        message: 'Successfully unregistered from event!', 
        severity: 'success' 
      });
      updateEventInState(result.event);
    } else {
      setSnackbar({ 
        open: true, 
        message: result.error || 'Unregistration failed!', 
        severity: 'error' 
      });
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setDetailModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDateFilter(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Show loading if either events or user data is loading
  const isLoading = loading || userLoading;

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
      
      <StudentHeader onMenuClick={handleDrawerToggle} />
      
      <StudentSidebar 
        activeTab={statusFilter}
        setActiveTab={setStatusFilter}
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
          pt: 2,
          backgroundColor: '#0a0a0a'
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
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 120,
                      height: 32,
                      background: 'linear-gradient(90deg, #333 25%, #444 50%, #333 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      borderRadius: 1
                    }}
                  />
                </Box>
              ) : (
                statusFilter === 'all' ? 'All Events' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) + ' Events'
              )}
            </Typography>
            <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
              {isLoading ? (
                <Box
                  sx={{
                    width: 200,
                    height: 20,
                    background: 'linear-gradient(90deg, #333 25%, #444 50%, #333 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    borderRadius: 1
                  }}
                />
              ) : (
                `${filteredEvents.length} events found`
              )}
            </Typography>
          </Box>

          {/* Enhanced Filters - Show even during loading but with skeleton state */}
          <EnhancedEventFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onClearFilters={handleClearFilters}
          />

          {/* Content Area */}
          {error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : isLoading ? (
            // Show skeleton loaders during loading
            <Box>
              {viewMode === 'grid' ? (
                <SkeletonLoader type="grid" count={8} />
              ) : (
                <Box sx={{ 
                  height: '70vh', 
                  background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
                  border: '1px solid #333',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <LoadingState 
                    message="Loading calendar view..." 
                    size="large"
                  />
                </Box>
              )}
            </Box>
          ) : filteredEvents.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              p: 6,
              background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
              borderRadius: 2,
              border: '1px solid #333',
              boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)'
            }}>
              <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 1 }}>
                No Events Found
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {events?.length === 0 ? "No events available yet." : "No events match your filters."}
              </Typography>
            </Box>
          ) : viewMode === 'grid' ? (
            <EventsGrid
              events={filteredEvents}
              registeredEvents={user?.eventsAttended || []}
              onRegister={handleRegister}
              onUnregister={handleUnregister}
              onViewDetails={handleViewDetails}
              searchTerm={searchTerm}
            />
          ) : (
            <EventsCalendar
              events={filteredEvents}
              onEventSelect={handleViewDetails}
            />
          )}

          {/* Event Detail Modal */}
          {selectedEvent && (
            <EventDetailModal
              event={selectedEvent}
              open={detailModalOpen}
              onClose={() => setDetailModalOpen(false)}
              onRegister={handleRegister}
              onUnregister={handleUnregister}
              isRegistered={user?.eventsAttended?.includes(selectedEvent._id) || false}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default StudentDashboard;