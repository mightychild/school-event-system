import { useState, useEffect } from 'react';
import { studentApi } from '../api/studentApi';

export const useEvents = (statusFilter = 'upcoming') => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await studentApi.getEvents({ status: statusFilter });
      console.log('Events fetched:', data);
      setEvents(data || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError(err.response?.data?.error || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const updateEventInState = (updatedEvent) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event._id === updatedEvent._id ? updatedEvent : event
      )
    );
  };

  useEffect(() => {
    fetchEvents();
  }, [statusFilter]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    updateEventInState
  };
};

export const useEventRegistration = () => {
  const registerForEvent = async (eventId) => {
    try {
      const { data } = await studentApi.registerForEvent(eventId);
      if (data.success) {
        return { success: true, event: data.event };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Registration error:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const unregisterFromEvent = async (eventId) => {
    try {
      const { data } = await studentApi.unregisterFromEvent(eventId);
      if (data.success) {
        return { success: true, event: data.event };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Unregistration error:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Unregistration failed' 
      };
    }
  };

  return {
    registerForEvent,
    unregisterFromEvent
  };
};