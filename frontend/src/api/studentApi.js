import api from './axios';

export const studentApi = {
  // Get all events with filtering
  getEvents: (params = {}) => api.get('/api/events', { params }),
  
  // Register for an event
  registerForEvent: (eventId) => api.post(`/api/events/${eventId}/register`),
  
  // Unregister from an event
  unregisterFromEvent: (eventId) => api.post(`/api/events/${eventId}/unregister`),
  
  // Get user profile with registered events
  getProfile: () => api.get('/api/auth/validate')
};

export default studentApi;