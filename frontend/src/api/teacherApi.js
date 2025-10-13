import api from './axios';

export const teacherApi = {
  // Dashboard data
  getDashboard: () => api.get('/api/teacher/dashboard'),
  
  // Events
  getEvents: (params = {}) => api.get('/api/teacher/events', { params }),
  createEvent: (data) => api.post('/api/events', data),
  updateEvent: (id, data) => api.put(`/api/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/api/events/${id}`),
  
  // Analytics
  getAnalytics: () => api.get('/api/teacher/analytics'),
  
  // Attendees
  getEventAttendees: (eventId) => api.get(`/api/teacher/events/${eventId}/attendees`),
  exportAttendees: (eventId) => api.get(`/api/teacher/events/${eventId}/export-attendees`)
};

export default teacherApi;