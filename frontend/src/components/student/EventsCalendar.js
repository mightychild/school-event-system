
import React from 'react';
import { Box, Typography } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const EventsCalendar = ({ events, onEventSelect }) => {
  // Use startTime and endTime from backend schema
  const calendarEvents = events.map(event => ({
    id: event._id,
    title: event.title,
    start: new Date(event.startTime),
    end: new Date(event.endTime),    
    status: event.status,
    allDay: false
  }));

  const eventStyleGetter = (event) => {
    let backgroundColor = '#1976d2'; // Default blue for upcoming
    if (event.status === 'ongoing') backgroundColor = '#4caf50'; // Green
    if (event.status === 'completed') backgroundColor = '#9e9e9e'; // Gray

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        fontSize: '12px'
      }
    };
  };

  return (
    <Box sx={{ height: '70vh', mt: 2 }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => {
          const selected = events.find(e => e._id === event.id);
          onEventSelect(selected);
        }}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        popup
        showMultiDayTimes
      />
    </Box>
  );
};

export default EventsCalendar;