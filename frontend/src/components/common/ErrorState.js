import { Box, Typography, Button, Alert } from '@mui/material';
import { Refresh, ErrorOutline } from '@mui/icons-material';
import UrbanButton from './UrbanButton';

const ErrorState = ({ error, onRetry }) => (
  <Box sx={{ 
    p: 4, 
    textAlign: 'center',
    background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
    border: '1px solid #333',
    borderRadius: 2,
    maxWidth: 500,
    mx: 'auto',
    my: 4
  }}>
    <ErrorOutline sx={{ 
      fontSize: 64, 
      color: '#f44336', 
      mb: 2,
      opacity: 0.7
    }} />
    <Alert 
      severity="error" 
      sx={{ 
        mb: 3,
        background: 'linear-gradient(145deg, #2a1a1a, #1a0f0f)',
        border: '1px solid #f44336',
        color: 'white',
        '& .MuiAlert-icon': {
          color: '#f44336'
        }
      }}
    >
      <Typography variant="body1" fontWeight="bold">{error}</Typography>
    </Alert>
    {onRetry && (
      <UrbanButton
        startIcon={<Refresh />}
        onClick={onRetry}
        sx={{ 
          background: 'linear-gradient(45deg, #f44336, #e57373)',
          '&:hover': {
            background: 'linear-gradient(45deg, #d32f2f, #ef5350)'
          }
        }}
      >
        Try Again
      </UrbanButton>
    )}
  </Box>
);

export default ErrorState;