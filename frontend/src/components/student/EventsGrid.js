import React from 'react';
import { Grid, Box } from '@mui/material';
import EventCard from './EventCard';
import EmptyEventsState from './EmptyEventsState';

const EventsGrid = ({ 
  events, 
  registeredEvents, 
  onRegister, 
  onUnregister, 
  onViewDetails,
  searchTerm 
}) => {
  if (!events || events.length === 0) {
    return (
      <EmptyEventsState 
        onClearFilters={searchTerm ? () => window.location.reload() : null}
      />
    );
  }

  return (
    <Grid container spacing={3}>
      {events.map((event) => (
        <Grid 
          item 
          key={event._id} 
          xs={12} 
          sm={6} 
          md={4} 
          lg={3}
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}
        >
          <EventCard
            event={event}
            isRegistered={registeredEvents.includes(event._id)}
            onRegister={onRegister}
            onUnregister={onUnregister}
            onViewDetails={onViewDetails}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default EventsGrid;