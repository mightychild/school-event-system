// src/utils/exportUtils.js
export const exportToCSV = ({ data, headers, filename }) => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Create CSV header
  const csvHeader = headers.map(h => h.label).join(',');
  
  // Create CSV rows
  const csvRows = data.map(item => 
    headers.map(header => {
      const value = item[header.key];
      // Handle undefined/null values and escape commas
      return `"${(value !== null && value !== undefined ? String(value) : '').replace(/"/g, '""')}"`;
    }).join(',')
  ).join('\n');

  const csvContent = `${csvHeader}\n${csvRows}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};