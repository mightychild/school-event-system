
import { Box, Typography, Button } from '@mui/material';
import { EventNote } from '@mui/icons-material';

const EmptyEventsState = ({ onClearFilters }) => (
  <Box 
    textAlign="center" 
    p={4} 
    sx={{ 
      background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
      borderRadius: 2,
      border: '1px solid #333'
    }}
  >
    <EventNote sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
    <Typography variant="h6" gutterBottom color="text.secondary">
      No Events Found
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      {onClearFilters 
        ? "Try adjusting your filters or check back later for new events."
        : "No events are scheduled yet. Check back later!"
      }
    </Typography>
    {onClearFilters && (
      <Button variant="outlined" onClick={onClearFilters}>
        Clear Filters
      </Button>
    )}
  </Box>
);

export default EmptyEventsState;