import React from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Avatar, 
  Divider, 
  Chip,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress
} from '@mui/material';
import { 
  Close, 
  CalendarToday, 
  LocationOn, 
  People,
  Category,
  Person
} from '@mui/icons-material';
import { formatDateTime } from '../utils/format';
import UrbanButton from '../common/UrbanButton';
import { UrbanOutlineButton } from '../common/UrbanOutlineButton';

const EventDetailModal = ({ event, open, onClose, onRegister, onUnregister, isRegistered }) => {
  if (!event) return null;

  const attendancePercentage = Math.min(
    Math.round((event.attendees?.length / (event.capacity || 100)) * 100),
    100
  );

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '85%', md: '75%', lg: '60%' },
    bgcolor: '#1a1a1a',
    background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
    p: 3,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '1px solid #333'
  };

  const detailBoxStyle = {
    p: 2, 
    border: '1px solid #333', 
    borderRadius: 2,
    background: 'linear-gradient(145deg, #232323, #1e1e1e)'
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8,
            color: '#b0b0b0',
            '&:hover': {
              color: '#FF6B35',
              backgroundColor: 'rgba(255, 107, 53, 0.1)'
            }
          }}
        >
          <Close />
        </IconButton>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            {event.imageUrl && (
              <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', border: '1px solid #333' }}>
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} 
                />
              </Box>
            )}
            
            <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
              {event.title}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip 
                icon={<CalendarToday fontSize="small" />}
                label={formatDateTime(event.datetime)}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  color: '#FF6B35',
                  border: '1px solid rgba(255, 107, 53, 0.3)'
                }}
              />
              <Chip 
                icon={<LocationOn fontSize="small" />}
                label={event.venue}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  color: '#FF6B35',
                  border: '1px solid rgba(255, 107, 53, 0.3)'
                }}
              />
              {event.categories?.map(category => (
                <Chip 
                  key={category} 
                  icon={<Category fontSize="small" />}
                  label={category} 
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255, 107, 53, 0.2)',
                    color: 'white',
                    border: '1px solid #FF6B35'
                  }}
                />
              ))}
            </Box>
            
            <Typography variant="body1" paragraph sx={{ color: '#b0b0b0', lineHeight: 1.6 }}>
              {event.description}
            </Typography>
            
            {event.attendees?.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3, color: 'white' }}>
                  Attendees ({event.attendees.length})
                </Typography>
                <List dense sx={{ maxHeight: 200, overflow: 'auto', backgroundColor: '#0f0f0f', borderRadius: 1 }}>
                  {event.attendees.map(attendee => (
                    <ListItem key={attendee._id} sx={{ borderBottom: '1px solid #333' }}>
                      <ListItemIcon>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32,
                          background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {attendee.name.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" sx={{ color: 'white' }}>
                            {attendee.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {attendee.email}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 300 }, mt: { xs: 3, md: 0 } }}>
            <Box sx={detailBoxStyle}>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Event Details
              </Typography>
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40, color: '#FF6B35' }}><People /></ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        Capacity
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        {event.attendees?.length || 0} / {event.capacity || 'Unlimited'}
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40, color: '#FF6B35' }}><Person /></ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        Organizer
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        {event.createdBy?.name || 'Admin'}
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
              
              <LinearProgress 
                variant="determinate" 
                value={attendancePercentage} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4, 
                  my: 2,
                  backgroundColor: '#333',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#FF6B35',
                    background: 'linear-gradient(45deg, #FF6B35, #FF8E53)'
                  }
                }} 
              />
              
              <Divider sx={{ my: 2, borderColor: '#333' }} />
              
              {isRegistered ? (
                <UrbanOutlineButton
                  fullWidth 
                  onClick={() => {
                    onUnregister(event._id);
                    onClose();
                  }}
                  sx={{ mb: 1 }}
                >
                  Unregister
                </UrbanOutlineButton>
              ) : (
                <UrbanButton
                  fullWidth 
                  onClick={() => {
                    onRegister(event._id);
                    onClose();
                  }}
                  disabled={event.status !== 'upcoming' || event.attendees?.length >= event.capacity}
                >
                  {event.attendees?.length >= event.capacity ? 'Full' : 'Register'}
                </UrbanButton>
              )}
              
              {event.status === 'upcoming' && event.attendees?.length >= event.capacity && (
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#FF6B35' }}>
                  This event has reached maximum capacity
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EventDetailModal;