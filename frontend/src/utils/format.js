// src/utils/format.js
export const formatDateTime = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTimeRange = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  const dateOptions = { month: 'short', day: 'numeric' };
  
  const startDateStr = start.toLocaleDateString(undefined, dateOptions);
  const endDateStr = end.toLocaleDateString(undefined, dateOptions);
  
  const startTimeStr = start.toLocaleTimeString(undefined, timeOptions);
  const endTimeStr = end.toLocaleTimeString(undefined, timeOptions);
  
  if (startDateStr === endDateStr) {
    return `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
  } else {
    return `${startDateStr} ${startTimeStr} - ${endDateStr} ${endTimeStr}`;
  }
};