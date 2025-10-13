import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Tooltip,
  Button
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  People
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/format';
import UrbanButton from '../common/UrbanButton';
import { UrbanOutlineButton } from '../common/UrbanOutlineButton';

const EventCard = ({ 
  event, 
  isRegistered, 
  onRegister, 
  onUnregister, 
  onViewDetails 
}) => {
  if (!event) return null;

  const isFull = event.capacity && event.attendees?.length >= event.capacity;
  const isUpcoming = event.status === 'upcoming';
  const isOngoing = event.status === 'ongoing';
  const isCompleted = event.status === 'completed';

  const canRegister = isUpcoming && !isFull && !isRegistered;
  const canUnregister = isUpcoming && isRegistered;

  const getStatusBackground = (status) => {
    switch (status) {
      case 'upcoming': return 'linear-gradient(45deg, #FF6B35, #FF8E53)';
      case 'ongoing': return 'linear-gradient(45deg, #4CAF50, #45a049)';
      case 'completed': return 'linear-gradient(45deg, #757575, #9e9e9e)';
      default: return 'linear-gradient(45deg, #FF6B35, #FF8E53)';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
        border: '1px solid #333',
        borderRadius: 2,
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(255, 107, 53, 0.2)',
          borderColor: '#FF6B35'
        }
      }}
      onClick={() => onViewDetails(event)}
    >
      {/* Status Header */}
      <Box sx={{ 
        background: getStatusBackground(event.status),
        color: 'white',
        px: 2,
        py: 1,
        textAlign: 'center'
      }}>
        <Typography variant="caption" fontWeight="bold">
          {event.status?.toUpperCase() || 'UPCOMING'}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" gutterBottom noWrap sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
          {event.title || 'Untitled Event'}
        </Typography>

        {/* Event Details */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
          <CalendarToday fontSize="small" sx={{ color: '#FF6B35', minWidth: 20 }} />
          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
            {event.startTime ? formatDateTime(event.startTime) : 'Date not set'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
          <LocationOn fontSize="small" sx={{ color: '#FF6B35', minWidth: 20 }} />
          <Typography variant="body2" sx={{ color: '#b0b0b0' }} noWrap>
            {event.venue || 'Venue not set'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
          <People fontSize="small" sx={{ color: '#FF6B35', minWidth: 20 }} />
          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
            {event.attendees?.length || 0} 
            {event.capacity ? ` / ${event.capacity}` : ''} attending
            {isFull && ' • FULL'}
          </Typography>
        </Box>

        {/* Event Description Preview */}
        <Typography variant="body2" sx={{ 
          color: '#888',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4
        }}>
          {event.description || 'No description available'}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          {canUnregister && (
            <Tooltip title="Unregister from event">
              <UrbanOutlineButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onUnregister(event._id);
                }}
              >
                Registered
              </UrbanOutlineButton>
            </Tooltip>
          )}
          
          {canRegister && (
            <Tooltip title={isFull ? "Event is full" : "Register for event"}>
              <UrbanButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRegister(event._id);
                }}
                disabled={isFull}
              >
                {isFull ? 'Full' : 'Register'}
              </UrbanButton>
            </Tooltip>
          )}

          {isOngoing && (
            <UrbanOutlineButton 
              size="small" 
              disabled
              sx={{
                '&.Mui-disabled': {
                  border: '2px solid #4CAF50 !important',
                  color: '#4CAF50 !important',
                  background: 'transparent !important'
                }
              }}
            >
              Ongoing
            </UrbanOutlineButton>
          )}

          {isCompleted && (
            <UrbanOutlineButton 
              size="small" 
              disabled
              sx={{
                '&.Mui-disabled': {
                  border: '2px solid #757575 !important',
                  color: '#757575 !important',
                  background: 'transparent !important'
                }
              }}
            >
              Completed
            </UrbanOutlineButton>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default EventCard;