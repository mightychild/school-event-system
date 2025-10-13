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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  People as PeopleIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { teacherApi } from '../../api/teacherApi';
import { exportToCSV } from '../../utils/exportUtils';
import UrbanButton from '../common/UrbanButton';
import { UrbanOutlineButton } from '../common/UrbanOutlineButton';

const TeacherAttendees = ({ onShowSnackbar }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [attendeesDialogOpen, setAttendeesDialogOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await teacherApi.getEvents();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      onShowSnackbar('Failed to fetch events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventAttendees = async (eventId) => {
    try {
      setLoading(true);
      const { data } = await teacherApi.getEventAttendees(eventId);
      setAttendees(data.attendees || []);
      setAttendeesDialogOpen(true);
    } catch (error) {
      console.error('Failed to fetch attendees:', error);
      onShowSnackbar('Failed to fetch attendees', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportAttendees = async (eventId) => {
    try {
      setExporting(true);
      const { data } = await teacherApi.exportAttendees(eventId);
      
      const event = events.find(e => e._id === eventId);
      const timestamp = new Date().toISOString().split('T')[0];
      
      exportToCSV({
        data: data.attendees || data,
        headers: [
          { key: 'no', label: 'No.' },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' }
        ],
        filename: `attendees-${event?.title || 'event'}-${timestamp}`
      });
      
      onShowSnackbar('Attendees exported successfully', 'success');
    } catch (error) {
      console.error('Failed to export attendees:', error);
      onShowSnackbar('Failed to export attendees', 'error');
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'primary';
      case 'ongoing': return 'success';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  if (loading && events.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress sx={{ color: '#FF6B35' }} />
        <Typography variant="h6" sx={{ ml: 2, color: 'white' }}>
          Loading events...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#0a0a0a', minHeight: '100vh', p: 0 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        color: 'white',
        fontWeight: 'bold',
        background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Event Attendees
      </Typography>
      
      <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
        Manage and export attendee lists for your events.
      </Typography>

      {events.length === 0 ? (
        <Alert severity="info" sx={{ 
          background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
          border: '1px solid #333',
          color: 'white'
        }}>
          No events found. Create events to manage attendees.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} md={6} key={event._id}>
              <Card sx={{ 
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
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
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
                          label={`${event.attendees.length} attendees`}
                          variant="outlined"
                          size="small"
                          sx={{ 
                            borderColor: '#444',
                            color: '#b0b0b0'
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        {event.venue} • {new Date(event.startTime).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <UrbanOutlineButton
                      size="small" 
                      startIcon={<PeopleIcon />}
                      onClick={() => fetchEventAttendees(event._id)}
                    >
                      View Attendees
                    </UrbanOutlineButton>
                    <UrbanButton
                      size="small" 
                      startIcon={<DownloadIcon />}
                      onClick={() => handleExportAttendees(event._id)}
                      disabled={exporting}
                    >
                      {exporting ? 'Exporting...' : 'Export'}
                    </UrbanButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Attendees Dialog */}
      <Dialog 
        open={attendeesDialogOpen} 
        onClose={() => setAttendeesDialogOpen(false)}
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
          Event Attendees ({attendees.length})
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} sx={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>#</TableCell>
                  <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendees.map((attendee, index) => (
                  <TableRow key={attendee._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ color: 'white' }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{attendee.name}</TableCell>
                    <TableCell sx={{ color: '#b0b0b0' }}>{attendee.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={attendee.role}
                        size="small"
                        sx={{
                          backgroundColor: 
                            attendee.role === 'student' ? 'rgba(76, 175, 80, 0.2)' :
                            attendee.role === 'teacher' ? 'rgba(255, 107, 53, 0.2)' : 'rgba(158, 158, 158, 0.2)',
                          color: 
                            attendee.role === 'student' ? '#4CAF50' :
                            attendee.role === 'teacher' ? '#FF6B35' : '#9e9e9e'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {attendees.length === 0 && (
            <Typography sx={{ color: '#b0b0b0', textAlign: 'center', py: 3 }}>
              No attendees found for this event.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #333', p: 2 }}>
          <UrbanOutlineButton onClick={() => setAttendeesDialogOpen(false)}>
            Close
          </UrbanOutlineButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherAttendees;