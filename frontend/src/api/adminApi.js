import api from './axios';

export const adminApi = {
  Analytics
  getDashboardStats: () => api.get('/api/analytics/dashboard-stats'),
  getEventAnalytics: (days = 30) => api.get(`/api/analytics/event-analytics?days=${days}`),
  
  Users
  getUsers: () => api.get('/api/admin/users'),
  createUser: (userData) => api.post('/api/admin/users', userData),
  updateUser: (id, userData) => api.put(`/api/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  
  Events
  getEvents: (params = {}) => api.get('/api/admin/events', { params }),
  getEventStats: () => api.get('/api/admin/events/stats'),
  updateEvent: (id, eventData) => api.put(`/api/admin/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/api/admin/events/${id}`),
  
  Reports
  getSystemReport: (startDate, endDate) => 
    api.get(`/api/reports/system?startDate=${startDate}&endDate=${endDate}`),
  exportEventsCSV: () => api.get('/api/reports/export-events'),
  getAttendanceReports: (eventId, userId) => 
    api.get(`/api/reports/attendance?eventId=${eventId}&userId=${userId}`)
};

export default adminApi;