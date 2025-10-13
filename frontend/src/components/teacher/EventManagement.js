import { 
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Stack,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { Edit, Delete, Refresh } from '@mui/icons-material';
import { formatDateTime } from '../../utils/format';
import api from '../../api/axios';

const EventManagement = ({ events, onEdit, onRefresh }) => {
  const handleDelete = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`);
      onRefresh();
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  if (events.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No events found</Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={onRefresh}>
          <Refresh />
        </IconButton>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{formatDateTime(event.datetime)}</TableCell>
                <TableCell>{event.venue}</TableCell>
                <TableCell>
                  <StatusChip status={event.status} />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(event)}>
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this event?')) {
                        handleDelete(event._id);
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

const StatusChip = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case 'upcoming': return 'primary';
      case 'ongoing': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'secondary';
    }
  };

  return (
    <Chip 
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={getColor()}
      variant="outlined"
    />
  );
};

export default EventManagement;