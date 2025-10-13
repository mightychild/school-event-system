import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../api/axios';

const EventFormModal = ({ open, onClose, event, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    datetime: new Date(),
    venue: '',
    status: 'upcoming'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        datetime: new Date(event.datetime),
        venue: event.venue,
        status: event.status
      });
    } else {
      // Reset to default values for new event
      setFormData({
        title: '',
        description: '',
        datetime: new Date(),
        venue: '',
        status: 'upcoming'
      });
    }
  }, [event, open]);

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.venue || !formData.datetime) {
        throw new Error('Title, venue, and date are required');
      }

      setLoading(true);
      setError(null);
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        datetime: formData.datetime.toISOString(), // Ensure ISO format
        venue: formData.venue,
        status: formData.status
      };

      console.log('Submitting event:', eventData); // Debug log

      if (event) {
        await api.put(`/events/${event._id}`, eventData);
      } else {
        await api.post('/events', eventData);
      }

      onSave();
      onClose();
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err.response?.data?.error || err.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {event ? 'Edit Event' : 'Create New Event'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              fullWidth
              margin="normal"
              required
              error={!formData.title && error?.includes('Title')}
            />

            <TextField
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              fullWidth
              margin="normal"
            />

            <DateTimePicker
              label="Date & Time"
              value={formData.datetime}
              onChange={(newValue) => setFormData({...formData, datetime: newValue})}
              minDateTime={new Date()} // Prevent past dates
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  margin="normal" 
                  required 
                  error={!formData.datetime && error?.includes('date')}
                />
              )}
            />

            <TextField
              label="Venue"
              value={formData.venue}
              onChange={(e) => setFormData({...formData, venue: e.target.value})}
              fullWidth
              margin="normal"
              required
              error={!formData.venue && error?.includes('Venue')}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !formData.title || !formData.venue || !formData.datetime}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : event ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventFormModal;