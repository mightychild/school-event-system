import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Grid,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  People,
  CalendarToday,
  LocationOn,
  AccessTime
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { formatDateTime } from '../../utils/format';
import { teacherApi } from '../../api/teacherApi';
import UrbanButton from '../common/UrbanButton';
import { UrbanOutlineButton } from '../common/UrbanOutlineButton';

const TeacherEvents = ({ onShowSnackbar }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    venue: '',
    capacity: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await teacherApi.getEvents();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      showSnackbar('Failed to fetch events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    const now = new Date();
    const defaultEndTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    setEventForm({
      title: '',
      description: '',
      startTime: now,
      endTime: defaultEndTime,
      venue: '',
      capacity: ''
    });
    setDialogOpen(true);
  };

  const handleEditEvent = (event) => {
    console.log('EDITING EVENT DATA:', event);
    
    setEditingEvent(event);
    
    // Parse dates and ensure they're valid
    const startTime = new Date(event.startTime);
    let endTime = new Date(event.endTime);
    
    // Ensure end time is at least 1 hour after start time
    const minEndTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    if (endTime <= startTime) {
      endTime = minEndTime;
      console.log('Adjusted end time to be after start time');
    }
    
    console.log('Final times - Start:', startTime, 'End:', endTime);
    console.log('Time difference:', (endTime - startTime) / (60 * 1000), 'minutes');
    
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      startTime: startTime,
      endTime: endTime,
      venue: event.venue || '',
      capacity: event.capacity || ''
    });
    setDialogOpen(true);
  };

  const handleSubmitEvent = async () => {
    setSubmitting(true);
    try {
      // Validate required fields
      if (!eventForm.title || !eventForm.venue || !eventForm.startTime || !eventForm.endTime) {
        showSnackbar('Title, venue, start time, and end time are required', 'error');
        return;
      }

      // Create new date objects
      const startTime = new Date(eventForm.startTime);
      let endTime = new Date(eventForm.endTime);

      console.log('ORIGINAL TIMES:');
      console.log('Start Time:', startTime, startTime.toISOString());
      console.log('End Time:', endTime, endTime.toISOString());
      console.log('Difference (ms):', endTime - startTime);
      console.log('Difference (minutes):', (endTime - startTime) / (60 * 1000));
      console.log('Is end after start?', endTime > startTime);

      // CRITICAL FIX: Add a buffer to ensure end time is clearly after start time
      const bufferMs = 5 * 60 * 1000; // 5 minute buffer
      const minEndTime = new Date(startTime.getTime() + bufferMs);
      
      if (endTime <= startTime) {
        console.log('Auto-adjusting end time with buffer');
        endTime = minEndTime;
      } else if (endTime - startTime < bufferMs) {
        // If the difference is too small, increase it
        console.log('Increasing time difference to meet buffer');
        endTime = minEndTime;
      }

      // Final validation
      if (endTime <= startTime) {
        console.error('VALIDATION FAILED: End time must be after start time');
        showSnackbar('End time must be after start time', 'error');
        return;
      }

      // Validate event is not in the past
      const now = new Date();
      if (endTime < now) {
        showSnackbar('Cannot create events in the past', 'error');
        return;
      }

      // Use UTC dates to avoid timezone issues
      const startTimeUTC = new Date(startTime.getTime() - (startTime.getTimezoneOffset() * 60000));
      const endTimeUTC = new Date(endTime.getTime() - (endTime.getTimezoneOffset() * 60000));

      console.log('UTC TIMES:');
      console.log('Start Time UTC:', startTimeUTC.toISOString());
      console.log('End Time UTC:', endTimeUTC.toISOString());
      console.log('UTC Difference (ms):', endTimeUTC - startTimeUTC);
      console.log('UTC Difference (minutes):', (endTimeUTC - startTimeUTC) / (60 * 1000));

      // Prepare data for submission - use UTC times
      const eventData = {
        title: eventForm.title,
        description: eventForm.description,
        startTime: startTimeUTC.toISOString(),
        endTime: endTimeUTC.toISOString(),
        venue: eventForm.venue,
        capacity: eventForm.capacity ? parseInt(eventForm.capacity) : null
      };

      console.log('FINAL SUBMISSION DATA:', eventData);

      let response;
      if (editingEvent) {
        console.log('UPDATING EVENT:', editingEvent._id);
        response = await teacherApi.updateEvent(editingEvent._id, eventData);
        console.log('UPDATE RESPONSE:', response);
        showSnackbar('Event updated successfully');
      } else {
        console.log('CREATING NEW EVENT');
        response = await teacherApi.createEvent(eventData);
        console.log('CREATE RESPONSE:', response);
        showSnackbar('Event created successfully');
      }

      setDialogOpen(false);
      fetchEvents();
    } catch (error) {
      
      if (error.response) {
        
        const errorData = error.response.data;
        let errorMessage = 'Operation failed';
        
        if (errorData.details) {
          errorMessage = `Validation error: ${errorData.details}`;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        
        showSnackbar(errorMessage, 'error');
        
        // If it's still a time validation error, show a more specific message
        if (errorMessage.includes('End time must be after start time')) {
          showSnackbar('Time validation error. Please ensure end time is at least 5 minutes after start time.', 'error');
        }
      } else {
        showSnackbar('Request failed: ' + error.message, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await teacherApi.deleteEvent(eventId);
        showSnackbar('Event deleted successfully');
        fetchEvents();
      } catch (error) {
        showSnackbar('Failed to delete event', 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'primary';
      case 'ongoing': return 'success';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const calculateDuration = (startTime, endTime) => {
    const durationMs = new Date(endTime) - new Date(startTime);
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const EventCard = ({ event }) => (
    <Card sx={{ 
      mb: 2, 
      background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
      border: '1px solid #333',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: '#FF6B35',
        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.2)',
        transform: 'translateY(-2px)'
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
              {event.title}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip 
                icon={<CalendarToday />}
                label={formatDateTime(event.startTime)}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  color: '#FF6B35',
                  border: '1px solid rgba(255, 107, 53, 0.3)'
                }}
              />
              <Chip 
                icon={<AccessTime />}
                label={calculateDuration(event.startTime, event.endTime)}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  color: '#FF6B35',
                  border: '1px solid rgba(255, 107, 53, 0.3)'
                }}
              />
              <Chip 
                icon={<LocationOn />}
                label={event.venue}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  color: '#FF6B35',
                  border: '1px solid rgba(255, 107, 53, 0.3)'
                }}
              />
              <Chip 
                label={event.status}
                size="small"
                sx={{
                  backgroundColor: 
                    event.status === 'upcoming' ? 'rgba(255, 107, 53, 0.2)' :
                    event.status === 'ongoing' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(158, 158, 158, 0.2)',
                  color: 
                    event.status === 'upcoming' ? '#FF6B35' :
                    event.status === 'ongoing' ? '#4CAF50' : '#9e9e9e',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              />
            </Box>

            <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2, lineHeight: 1.6 }}>
              {event.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <People fontSize="small" sx={{ color: '#FF6B35' }} />
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  {event.attendees?.length || 0} attendees
                  {event.capacity && ` / ${event.capacity}`}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              size="small" 
              sx={{ 
                color: '#FF6B35',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)'
                }
              }}
              onClick={() => handleEditEvent(event)}
            >
              <Edit />
            </IconButton>
            <IconButton 
              size="small" 
              sx={{ 
                color: '#f44336',
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.1)'
                }
              }}
              onClick={() => handleDeleteEvent(event._id)}
            >
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ 
        p: 3, 
        background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
        border: '1px solid #333',
        minHeight: '100vh'
      }}>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ 
            color: 'white',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            My Events
          </Typography>
          <UrbanButton startIcon={<Add />} onClick={handleCreateEvent}>
            Create Event
          </UrbanButton>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#FF6B35' }} />
          </Box>
        ) : events.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            p: 6,
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            borderRadius: 2,
            border: '1px solid #333'
          }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
              No events found
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3 }}>
              You haven't created any events yet.
            </Typography>
            <UrbanButton startIcon={<Add />} onClick={handleCreateEvent}>
              Create Your First Event
            </UrbanButton>
          </Box>
        ) : (
          <Box>
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </Box>
        )}

        {/* Create/Edit Event Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
              border: '1px solid #333'
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', borderBottom: '1px solid #333' }}>
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Event Title"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                fullWidth
                required
                error={!eventForm.title}
                helperText={!eventForm.title ? "Title is required" : ""}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#444' },
                    '&:hover fieldset': { borderColor: '#FF6B35' },
                    '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                  },
                  '& .MuiInputLabel-root': { color: '#b0b0b0' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' }
                }}
              />
              
              <TextField
                label="Description"
                multiline
                rows={3}
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#444' },
                    '&:hover fieldset': { borderColor: '#FF6B35' },
                    '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                  },
                  '& .MuiInputLabel-root': { color: '#b0b0b0' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' }
                }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DateTimePicker
                    label="Start Time"
                    value={eventForm.startTime}
                    onChange={(date) => {
                      const newStartTime = new Date(date);
                      let newEndTime = new Date(eventForm.endTime);
                      
                      // Ensure end time is at least 1 hour after new start time
                      const minEndTime = new Date(newStartTime.getTime() + 60 * 60 * 1000);
                      if (newEndTime <= newStartTime) {
                        newEndTime = minEndTime;
                      }
                      
                      setEventForm({
                        ...eventForm, 
                        startTime: newStartTime,
                        endTime: newEndTime
                      });
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        required 
                        error={!eventForm.startTime}
                        helperText={!eventForm.startTime ? "Start time is required" : ""}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': { borderColor: '#444' },
                            '&:hover fieldset': { borderColor: '#FF6B35' },
                            '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                          },
                          '& .MuiInputLabel-root': { color: '#b0b0b0' },
                          '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' }
                        }}
                      />
                    )}
                    minDateTime={new Date()}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DateTimePicker
                    label="End Time"
                    value={eventForm.endTime}
                    onChange={(date) => {
                      setEventForm({...eventForm, endTime: new Date(date)});
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        required 
                        error={!eventForm.endTime || eventForm.endTime <= eventForm.startTime}
                        helperText={!eventForm.endTime ? "End time is required" : 
                                   eventForm.endTime <= eventForm.startTime ? "End time must be after start time" : ""}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': { borderColor: '#444' },
                            '&:hover fieldset': { borderColor: '#FF6B35' },
                            '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                          },
                          '& .MuiInputLabel-root': { color: '#b0b0b0' },
                          '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' }
                        }}
                      />
                    )}
                    minDateTime={new Date(eventForm.startTime.getTime() + 60 * 60 * 1000)} // At least 1 hour after start
                  />
                </Grid>
              </Grid>

              <TextField
                label="Venue"
                value={eventForm.venue}
                onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                fullWidth
                required
                error={!eventForm.venue}
                helperText={!eventForm.venue ? "Venue is required" : ""}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#444' },
                    '&:hover fieldset': { borderColor: '#FF6B35' },
                    '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                  },
                  '& .MuiInputLabel-root': { color: '#b0b0b0' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' }
                }}
              />

              <TextField
                label="Capacity (optional)"
                type="number"
                value={eventForm.capacity}
                onChange={(e) => setEventForm({...eventForm, capacity: e.target.value})}
                fullWidth
                helperText="Leave empty for unlimited capacity"
                InputProps={{ inputProps: { min: 1 } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#444' },
                    '&:hover fieldset': { borderColor: '#FF6B35' },
                    '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                  },
                  '& .MuiInputLabel-root': { color: '#b0b0b0' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' }
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid #333', p: 2 }}>
            <UrbanOutlineButton onClick={() => setDialogOpen(false)} disabled={submitting}>
              Cancel
            </UrbanOutlineButton>
            <UrbanButton 
              onClick={handleSubmitEvent}
              disabled={submitting || !eventForm.title || !eventForm.venue || !eventForm.startTime || !eventForm.endTime || eventForm.endTime <= eventForm.startTime}
            >
              {submitting ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : editingEvent ? 'Update Event' : 'Create Event'}
            </UrbanButton>
          </DialogActions>
        </Dialog>
      </Paper>
    </LocalizationProvider>
  );
};

export default TeacherEvents;