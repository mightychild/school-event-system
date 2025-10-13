import { Box, CircularProgress, Typography, keyframes } from '@mui/material';

// Pulse animation for loading
const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const LoadingState = ({ message = "Loading events...", size = "large" }) => {
  const isLarge = size === "large";
  
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      p={isLarge ? 8 : 4}
      height={isLarge ? "60vh" : "200px"}
      sx={{
        animation: `${pulse} 2s ease-in-out infinite`,
      }}
    >
      <CircularProgress 
        size={isLarge ? 60 : 40}
        sx={{ 
          color: '#FF6B35',
          mb: 3,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }} 
      />
      <Typography 
        variant={isLarge ? "h6" : "body1"} 
        sx={{ 
          color: '#b0b0b0',
          textAlign: 'center',
          background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}
      >
        {message}
      </Typography>
      {isLarge && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
            textAlign: 'center',
            mt: 1,
            maxWidth: 300
          }}
        >
          Preparing your event dashboard...
        </Typography>
      )}
    </Box>
  );
};

export default LoadingState;