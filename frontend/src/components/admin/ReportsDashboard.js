import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Assessment as ReportIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { adminApi } from '../../api/adminApi';
import { exportToCSV } from '../../utils/exportUtils';
import UrbanButton from '../common/UrbanButton';
import { UrbanOutlineButton } from '../common/UrbanOutlineButton';

const ReportsDashboard = ({ onShowSnackbar }) => {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [previewData, setPreviewData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const reportTypes = [
    {
      id: 'system',
      title: 'System Report',
      description: 'Comprehensive system overview with user and event statistics',
      icon: <ReportIcon />,
      requiresDateRange: true
    },
    {
      id: 'events',
      title: 'Events Export',
      description: 'Export all events data to CSV format',
      icon: <EventIcon />,
      requiresDateRange: false
    },
    {
      id: 'attendance',
      title: 'Attendance Reports',
      description: 'Detailed attendance reports for events and users',
      icon: <PeopleIcon />,
      requiresDateRange: true
    }
  ];

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      
      const reports = {};
      
      try {
        const systemRes = await adminApi.getSystemReport('', '');
        reports.system = systemRes.data;
      } catch (error) {
        console.warn('Failed to fetch system report:', error);
        reports.system = generateFallbackSystemReport();
      }

      try {
        const eventsRes = await adminApi.exportEventsCSV();
        reports.events = eventsRes.data;
      } catch (error) {
        console.warn('Failed to fetch events data:', error);
        reports.events = generateFallbackEventsData();
      }

      setReportsData(reports);
      onShowSnackbar('Reports data loaded', 'success');

    } catch (error) {
      console.error('Failed to fetch reports data:', error);
      onShowSnackbar('Using demo reports data', 'warning');
      setReportsData(generateFallbackReportsData());
    } finally {
      setLoading(false);
    }
  };

  // Fallback data generators
  const generateFallbackSystemReport = () => ({
    reportPeriod: { startDate: '2024-01-01', endDate: '2024-02-01' },
    userStatistics: {
      totalUsers: 156,
      usersByRole: [
        { _id: 'student', count: 135 },
        { _id: 'teacher', count: 18 },
        { _id: 'admin', count: 3 }
      ]
    },
    eventStatistics: {
      totalEvents: 42,
      eventsByStatus: [
        { _id: 'upcoming', count: 15, totalAttendees: 0 },
        { _id: 'ongoing', count: 3, totalAttendees: 45 },
        { _id: 'completed', count: 24, totalAttendees: 560 }
      ]
    }
  });

  const generateFallbackEventsData = () => [
    {
      title: 'Math Workshop',
      description: 'Advanced mathematics workshop',
      startTime: '2024-02-15T10:00:00.000Z',
      venue: 'Room 101',
      status: 'completed',
      createdBy: 'John Smith',
      attendeesCount: 45,
      capacity: 50
    },
    {
      title: 'Science Fair',
      description: 'Annual science exhibition',
      startTime: '2024-02-20T14:00:00.000Z',
      venue: 'Main Hall',
      status: 'upcoming',
      createdBy: 'Sarah Johnson',
      attendeesCount: 120,
      capacity: 150
    }
  ];

  const generateFallbackReportsData = () => ({
    system: generateFallbackSystemReport(),
    events: generateFallbackEventsData()
  });

  useEffect(() => {
    fetchReportsData();
  }, []);

  const generateReport = async (reportId) => {
    try {
      setGenerating(true);
      let data;

      switch (reportId) {
        case 'system':
          data = await adminApi.getSystemReport(dateRange.startDate, dateRange.endDate);
          break;
        case 'events':
          data = await adminApi.exportEventsCSV();
          break;
        case 'attendance':
          data = await adminApi.getAttendanceReports();
          break;
        default:
          throw new Error('Unknown report type');
      }

      onShowSnackbar(`${getReportTitle(reportId)} generated successfully`, 'success');
      return data.data;

    } catch (error) {
      console.error('Failed to generate report:', error);
      
      const fallbackData = getFallbackReportData(reportId);
      onShowSnackbar(`Using demo data for ${getReportTitle(reportId)}`, 'warning');
      return fallbackData;
    } finally {
      setGenerating(false);
    }
  };

  const getFallbackReportData = (reportId) => {
    switch (reportId) {
      case 'system':
        return generateFallbackSystemReport();
      case 'events':
        return generateFallbackEventsData();
      case 'attendance':
        return [
          {
            title: 'Math Workshop',
            startTime: '2024-02-15T10:00:00.000Z',
            venue: 'Room 101',
            status: 'completed',
            attendeesCount: 45,
            capacity: 50,
            attendanceRate: 90
          }
        ];
      default:
        return [];
    }
  };

  const handleGenerateReport = async (reportId) => {
    const data = await generateReport(reportId);
    setPreviewData({ type: reportId, data });
    setPreviewOpen(true);
  };

  const handleExportReport = async (reportId) => {
    const data = await generateReport(reportId);
    exportReportData(reportId, data);
  };

  const exportReportData = (reportType, data) => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (reportType) {
      case 'system':
        exportToCSV({
          data: formatSystemReportData(data),
          headers: [
            { key: 'metric', label: 'Metric' },
            { key: 'value', label: 'Value' },
            { key: 'details', label: 'Details' }
          ],
          filename: `system-report-${timestamp}`
        });
        break;

      case 'events':
        exportToCSV({
          data: data.events || data,
          headers: [
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description' },
            { key: 'startTime', label: 'Start Time' },
            { key: 'venue', label: 'Venue' },
            { key: 'status', label: 'Status' },
            { key: 'createdBy', label: 'Created By' },
            { key: 'attendeesCount', label: 'Attendees Count' },
            { key: 'capacity', label: 'Capacity' }
          ],
          filename: `events-export-${timestamp}`
        });
        break;

      case 'attendance':
        exportToCSV({
          data: formatAttendanceData(data),
          headers: [
            { key: 'eventTitle', label: 'Event Title' },
            { key: 'date', label: 'Date' },
            { key: 'venue', label: 'Venue' },
            { key: 'attendeesCount', label: 'Attendees Count' },
            { key: 'attendanceRate', label: 'Attendance Rate %' },
            { key: 'status', label: 'Status' }
          ],
          filename: `attendance-report-${timestamp}`
        });
        break;
    }

    onShowSnackbar('Report exported successfully', 'success');
  };

  const formatSystemReportData = (data) => {
    return [
      { metric: 'Total Users', value: data.userStatistics?.totalUsers || 0, details: 'All registered users' },
      { metric: 'Total Events', value: data.eventStatistics?.totalEvents || 0, details: 'All created events' },
      { metric: 'Students', value: data.userStatistics?.usersByRole?.find(r => r._id === 'student')?.count || 0, details: 'Student users' },
      { metric: 'Teachers', value: data.userStatistics?.usersByRole?.find(r => r._id === 'teacher')?.count || 0, details: 'Teacher users' },
      { metric: 'Admins', value: data.userStatistics?.usersByRole?.find(r => r._id === 'admin')?.count || 0, details: 'Admin users' }
    ];
  };

  const formatAttendanceData = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map(item => ({
      eventTitle: item.title,
      date: item.startTime ? new Date(item.startTime).toLocaleDateString() : 'N/A',
      venue: item.venue,
      attendeesCount: item.attendeesCount || 0,
      attendanceRate: item.attendanceRate ? `${item.attendanceRate}%` : 'N/A',
      status: item.status
    }));
  };

  const getReportTitle = (reportId) => {
    return reportTypes.find(report => report.id === reportId)?.title || 'Report';
  };

  const renderPreviewContent = () => {
    if (!previewData) return null;

    switch (previewData.type) {
      case 'system':
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              System Report Preview
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
              Period: {previewData.data.reportPeriod?.startDate} to {previewData.data.reportPeriod?.endDate}
            </Typography>
            <TableContainer component={Paper} sx={{ 
              background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
              border: '1px solid #333'
            }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Metric</TableCell>
                    <TableCell align="right" sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Value</TableCell>
                    <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formatSystemReportData(previewData.data).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: 'white' }}>{row.metric}</TableCell>
                      <TableCell align="right" sx={{ color: 'white' }}>{row.value}</TableCell>
                      <TableCell sx={{ color: '#b0b0b0' }}>{row.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );

      case 'events':
        const events = previewData.data.events || previewData.data;
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Events Export Preview ({events.length} events)
            </Typography>
            <TableContainer component={Paper} sx={{ 
              maxHeight: 400,
              background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
              border: '1px solid #333'
            }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Title</TableCell>
                    <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Venue</TableCell>
                    <TableCell align="right" sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Attendees</TableCell>
                    <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.slice(0, 10).map((event, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: 'white' }}>{event.title}</TableCell>
                      <TableCell sx={{ color: '#b0b0b0' }}>
                        {event.startTime ? new Date(event.startTime).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ color: '#b0b0b0' }}>{event.venue}</TableCell>
                      <TableCell align="right" sx={{ color: 'white' }}>{event.attendeesCount || 0}</TableCell>
                      <TableCell>
                        <Chip 
                          label={event.status} 
                          size="small"
                          sx={{
                            backgroundColor: 
                              event.status === 'upcoming' ? 'rgba(255, 107, 53, 0.2)' :
                              event.status === 'ongoing' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(158, 158, 158, 0.2)',
                            color: 
                              event.status === 'upcoming' ? '#FF6B35' :
                              event.status === 'ongoing' ? '#4CAF50' : '#9e9e9e'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {events.length > 10 && (
              <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 1 }}>
                Showing first 10 of {events.length} events
              </Typography>
            )}
          </Box>
        );

      default:
        return (
          <Typography sx={{ color: 'white' }}>Preview not available for this report type.</Typography>
        );
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress sx={{ color: '#FF6B35' }} />
        <Typography variant="h6" sx={{ ml: 2, color: 'white' }}>
          Loading reports...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#0a0a0a', minHeight: '100vh', p: 0 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        color: 'white',
        fontWeight: 'bold',
        background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Reports & Analytics
      </Typography>
      
      <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
        Generate and download comprehensive system reports and analytics.
      </Typography>

      {/* Date Range Selector */}
      <Paper sx={{ 
        p: 3, 
        mb: 3,
        background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
        border: '1px solid #333'
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
          Report Parameters
        </Typography>
        <Grid container spacing={2} alignItems="end">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#FF6B35' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                },
                '& .MuiInputLabel-root': { color: '#b0b0b0' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#FF6B35' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                },
                '& .MuiInputLabel-root': { color: '#b0b0b0' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Report Types Grid */}
      <Grid container spacing={3}>
        {reportTypes.map((report) => (
          <Grid item xs={12} md={6} key={report.id}>
            <Card sx={{ 
              background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
              border: '1px solid #333',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#FF6B35',
                boxShadow: '0 8px 25px rgba(255, 107, 53, 0.2)',
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: '#FF6B35', mr: 2 }}>
                    {report.icon}
                  </Box>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {report.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                  {report.description}
                </Typography>
                {report.requiresDateRange && (
                  <Chip 
                    icon={<CalendarIcon />}
                    label="Requires date range"
                    size="small"
                    variant="outlined"
                    sx={{ 
                      borderColor: '#444',
                      color: '#b0b0b0'
                    }}
                  />
                )}
              </CardContent>
              <CardActions>
                <UrbanOutlineButton
                  startIcon={<ViewIcon />}
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={generating}
                >
                  {generating ? 'Generating...' : 'Preview'}
                </UrbanOutlineButton>
                <UrbanButton
                  startIcon={<DownloadIcon />}
                  onClick={() => handleExportReport(report.id)}
                  disabled={generating}
                >
                  Export CSV
                </UrbanButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Report Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', borderBottom: '1px solid #333' }}>
          {previewData ? getReportTitle(previewData.type) : 'Report Preview'}
        </DialogTitle>
        <DialogContent>
          {renderPreviewContent()}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #333', p: 2 }}>
          <UrbanOutlineButton onClick={() => setPreviewOpen(false)}>
            Close
          </UrbanOutlineButton>
          {previewData && (
            <UrbanButton
              startIcon={<DownloadIcon />}
              onClick={() => {
                exportReportData(previewData.type, previewData.data);
                setPreviewOpen(false);
              }}
            >
              Export Report
            </UrbanButton>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsDashboard;