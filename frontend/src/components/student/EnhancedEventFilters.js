import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ViewModule,
  CalendarViewMonth,
  FilterList,
  Clear
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import UrbanButton from '../common/UrbanButton';
import { UrbanOutlineButton } from '../common/UrbanOutlineButton';

const EnhancedEventFilters = ({
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  viewMode,
  setViewMode,
  statusFilter,
  setStatusFilter,
  onClearFilters
}) => {
  const statuses = ['upcoming', 'ongoing', 'completed'];

  return (
    <Box sx={{ 
      p: 2, 
      mb: 3, 
      borderRadius: 2,
      background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
      border: '1px solid #333',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      {/* Main Filter Row */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        {/* Search */}
        <TextField
          label="Search events..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            sx: {
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#444'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF6B35'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF6B35'
              }
            }
          }}
          InputLabelProps={{
            sx: { color: '#b0b0b0' }
          }}
        />


        {/* View Mode Toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && setViewMode(newMode)}
          size="small"
        >
          <Tooltip title="Grid View">
            <ToggleButton value="grid" sx={{ 
              color: viewMode === 'grid' ? 'white' : '#b0b0b0',
              backgroundColor: viewMode === 'grid' ? '#FF6B35' : 'transparent',
              borderColor: '#444',
              '&:hover': {
                backgroundColor: viewMode === 'grid' ? '#E55A2B' : 'rgba(255, 107, 53, 0.1)'
              }
            }}>
              <ViewModule />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Calendar View">
            <ToggleButton value="calendar" sx={{ 
              color: viewMode === 'calendar' ? 'white' : '#b0b0b0',
              backgroundColor: viewMode === 'calendar' ? '#FF6B35' : 'transparent',
              borderColor: '#444',
              '&:hover': {
                backgroundColor: viewMode === 'calendar' ? '#E55A2B' : 'rgba(255, 107, 53, 0.1)'
              }
            }}>
              <CalendarViewMonth />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>

        {/* Clear Filters Button */}
        {(searchTerm || dateFilter) && (
          <UrbanOutlineButton
            startIcon={<Clear />}
            onClick={onClearFilters}
            size="small"
          >
            Clear
          </UrbanOutlineButton>
        )}
      </Stack>

      {/* Status Filter Chips */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {statuses.map(status => (
          <Chip
            key={status}
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            onClick={() => setStatusFilter(status)}
            color={statusFilter === status ? 'primary' : 'default'}
            variant={statusFilter === status ? 'filled' : 'outlined'}
            size="small"
            sx={{
              backgroundColor: statusFilter === status ? '#FF6B35' : 'transparent',
              color: statusFilter === status ? 'white' : '#b0b0b0',
              borderColor: statusFilter === status ? '#FF6B35' : '#444',
              '&:hover': {
                backgroundColor: statusFilter === status ? '#E55A2B' : 'rgba(255, 107, 53, 0.1)'
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default EnhancedEventFilters;