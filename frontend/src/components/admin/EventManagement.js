import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { adminApi } from '../../api/adminApi';
import { formatDateTime } from '../../utils/format';
import UrbanButton from '../common/UrbanButton';
import { UrbanOutlineButton } from '../common/UrbanOutlineButton';

const EventManagement = ({ onShowSnackbar }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await adminApi.getEvents({ populate: 'createdBy,attendees' });
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await adminApi.deleteEvent(eventId);
        onShowSnackbar('Event deleted successfully', 'success');
        fetchEvents();
      } catch (error) {
        onShowSnackbar('Failed to delete event', 'error');
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

  const StatusChip = ({ status }) => (
    <Chip 
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      size="small"
      sx={{
        backgroundColor: 
          status === 'upcoming' ? 'rgba(255, 107, 53, 0.2)' :
          status === 'ongoing' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(158, 158, 158, 0.2)',
        color: 
          status === 'upcoming' ? '#FF6B35' :
          status === 'ongoing' ? '#4CAF50' : '#9e9e9e'
      }}
    />
  );

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
        color: 'white'
      }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ 
      p: 3, 
      background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
      border: '1px solid #333',
      minHeight: '100vh'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ 
          color: 'white',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Event Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <UrbanOutlineButton 
            startIcon={<RefreshIcon />}
            onClick={fetchEvents}
          >
            Refresh
          </UrbanOutlineButton>
          <UrbanButton 
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add Event
          </UrbanButton>
        </Box>
      </Box>

      {events.length === 0 ? (
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
            There are no events in the system yet.
          </Typography>
          <UrbanButton startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            Create First Event
          </UrbanButton>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ 
          background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
          border: '1px solid #333'
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Date & Time</TableCell>
                <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Venue</TableCell>
                <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Organizer</TableCell>
                <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Attendees</TableCell>
                <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'medium' }}>{event.title}</TableCell>
                  <TableCell sx={{ color: '#b0b0b0' }}>{formatDateTime(event.startTime)}</TableCell>
                  <TableCell sx={{ color: '#b0b0b0' }}>{event.venue}</TableCell>
                  <TableCell sx={{ color: '#b0b0b0' }}>{event.createdBy?.name || 'Unknown'}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{event.attendees?.length || 0}</TableCell>
                  <TableCell>
                    <StatusChip status={event.status} />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      sx={{ 
                        color: '#FF6B35',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 107, 53, 0.1)'
                        }
                      }}
                      onClick={() => setEditingEvent(event)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      sx={{ 
                        color: '#f44336',
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.1)'
                        }
                      }}
                      onClick={() => handleDelete(event._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Event Dialog */}
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
              fullWidth
              margin="normal"
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
              fullWidth
              margin="normal"
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
              label="Venue"
              fullWidth
              margin="normal"
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

            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: '#b0b0b0' }}>Status</InputLabel>
              <Select
                label="Status"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FF6B35' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF6B35' },
                }}
              >
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Capacity"
              type="number"
              fullWidth
              margin="normal"
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
          <UrbanOutlineButton onClick={() => setDialogOpen(false)}>
            Cancel
          </UrbanOutlineButton>
          <UrbanButton variant="contained">
            {editingEvent ? 'Update Event' : 'Create Event'}
          </UrbanButton>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EventManagement;