import { Box, Typography, Button } from '@mui/material';
import { EventNote } from '@mui/icons-material';
import UrbanButton from '../common/UrbanButton';
import { UrbanOutlineButton } from '../common/UrbanOutlineButton';

const EmptyEventsState = ({ onClearFilters }) => (
  <Box 
    textAlign="center" 
    p={6} 
    sx={{ 
      background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
      borderRadius: 2,
      border: '1px solid #333',
      boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)',
      maxWidth: 400,
      mx: 'auto',
      my: 4
    }}
  >
    <EventNote sx={{ 
      fontSize: 64, 
      color: '#FF6B35', 
      mb: 2,
      opacity: 0.7
    }} />
    <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 1 }}>
      No Events Found
    </Typography>
    <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3 }}>
      {onClearFilters 
        ? "Try adjusting your filters or check back later for new events."
        : "No events are scheduled yet. Check back later!"
      }
    </Typography>
    {onClearFilters && (
      <UrbanOutlineButton onClick={onClearFilters}>
        Clear Filters
      </UrbanOutlineButton>
    )}
  </Box>
);

export default EmptyEventsState;