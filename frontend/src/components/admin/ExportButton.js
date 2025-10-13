import { Button } from '@mui/material';
import { FileDownload } from '@mui/icons-material';
import { exportToCSV } from '../../utils/exportUtils';

export default function ExportButton({ data, filename }) {
  const handleExport = () => {
    const headers = [
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Role', key: 'role' },
      { label: 'Join Date', key: 'createdAt' }
    ];
    
    exportToCSV({
      data,
      headers,
      filename: `${filename}_${new Date().toISOString().slice(0,10)}`
    });
  };

  return (
    <Button 
      variant="contained" 
      startIcon={<FileDownload />}
      onClick={handleExport}
      disabled={!data.length}
    >
      Export CSV
    </Button>
  );
}