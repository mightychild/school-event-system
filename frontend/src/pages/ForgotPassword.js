import { useState } from 'react';
import { 
  Box, Button, TextField, Typography,
  InputAdornment, CircularProgress, Link
} from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { theme } from '../styles/theme';
import { fadeIn } from '../styles/animations';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful response
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div {...fadeIn} style={{ height: '100vh', background: theme.palette.background.default }}>
      <Box sx={{
        maxWidth: 500,
        mx: 'auto',
        p: 4,
        mt: 4,
        borderRadius: 4,
        bgcolor: 'background.paper',
        boxShadow: 24
      }}>
        <Button 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/login')}
          sx={{ mb: 2 }}
        >
          Back to Login
        </Button>

        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Forgot Password
        </Typography>
        
        {success ? (
          <>
            <Typography align="center" sx={{ my: 3 }}>
              Password reset instructions have been sent to <strong>{email}</strong>.
              Please check your email.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Return to Login
            </Button>
          </>
        ) : (
          <>
            <Typography align="center" sx={{ mb: 3 }}>
              Enter your email address and we'll send you a link to reset your password.
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                helperText={error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button 
                fullWidth 
                type="submit" 
                variant="contained" 
                disabled={loading}
                sx={{ mt: 3, py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </>
        )}
      </Box>
    </motion.div>
  );
}