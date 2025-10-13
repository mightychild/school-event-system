import React from 'react';
import { 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Stack,
  Button,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ViewModule, CalendarViewMonth } from '@mui/icons-material';

const EventFilters = ({ 
  searchTerm, 
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  dateFilter,
  setDateFilter,
  viewMode,
  setViewMode
}) => {
  return (
    <Stack spacing={2} sx={{ mb: 3 }} direction={{ xs: 'column', sm: 'row' }} alignItems="center">
      <TextField
        label="Search Events"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ flexGrow: 1 }}
      />
      
      
      <DatePicker
        label="Filter by Date"
        value={dateFilter}
        onChange={(newValue) => setDateFilter(newValue)}
        renderInput={(params) => <TextField {...params} size="small" sx={{ width: 180 }} />}
      />
      
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(e, newMode) => newMode && setViewMode(newMode)}
        aria-label="view mode"
      >
        <ToggleButton value="grid" aria-label="grid view">
          <ViewModule />
        </ToggleButton>
        <ToggleButton value="calendar" aria-label="calendar view">
          <CalendarViewMonth />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
};

export default EventFilters;