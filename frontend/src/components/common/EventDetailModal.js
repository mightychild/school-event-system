
import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Divider,
  LinearProgress
} from '@mui/material';
import { Close, CalendarToday, LocationOn, People } from '@mui/icons-material';
import { formatDateTime } from '../../utils/format';

const EventDetailModal = ({ event, open, onClose, onRegister, onUnregister, isRegistered }) => {
  if (!event) return null;

  const attendancePercentage = Math.min(
    Math.round((event.attendees?.length / (event.capacity || 100)) * 100),
    100
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '95%', sm: '85%', md: '75%', lg: '60%' },
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 3,
        borderRadius: 2,
        overflowY: 'auto'
      }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>

        <Typography variant="h4" gutterBottom>
          {event.title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<CalendarToday />}
            label={formatDateTime(event.datetime)}
            variant="outlined"
          />
          <Chip 
            icon={<LocationOn />}
            label={event.venue}
            variant="outlined"
          />
          <Chip 
            label={event.status}
            color={
              event.status === 'upcoming' ? 'primary' :
              event.status === 'ongoing' ? 'success' : 'default'
            }
          />
        </Box>

        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Event Details</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <People />
            <Typography>
              {event.attendees?.length || 0} / {event.capacity || '∞'} attending
            </Typography>
          </Box>
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={attendancePercentage} 
          sx={{ height: 8, borderRadius: 4, mb: 2 }} 
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          {isRegistered ? (
            <Button 
              variant="contained" 
              color="error"
              onClick={() => onUnregister(event._id)}
              fullWidth
            >
              Unregister from Event
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={() => onRegister(event._id)}
              disabled={event.status !== 'upcoming' || event.attendees?.length >= event.capacity}
              fullWidth
            >
              {event.attendees?.length >= event.capacity ? 'Event Full' : 'Register for Event'}
            </Button>
          )}
          <Button variant="outlined" onClick={onClose} fullWidth>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EventDetailModal;