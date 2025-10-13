import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Link as MuiLink,
  Container,
  Fade
} from '@mui/material';
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import UrbanButton from '../components/common/UrbanButton';
import { UrbanOutlineButton } from '../components/common/UrbanOutlineButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle session expired and other query parameters
    const urlParams = new URLSearchParams(location.search);
    
    if (urlParams.get('session_expired') === 'true') {
      setError('Your session has expired. Please login again.');
    }
    
    if (urlParams.get('unauthorized') === 'true') {
      setError('Please login to access this page.');
    }

    if (urlParams.get('registered') === 'true') {
      setError('Registration successful! Please login with your credentials.');
    }

    // Clear the query parameters
    if (location.search) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      // Navigation will be handled by the AuthContext
    } catch (err) {
      console.error('Login error:', err);
      
      // Enhanced error messages
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || 'Invalid request. Please check your input.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.message === 'Network Error') {
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.05) 0%, transparent 50%)',
        pointerEvents: 'none'
      }
    }}>
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={24}
            sx={{ 
              p: { xs: 3, sm: 4, md: 5 },
              background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
              border: '1px solid #333',
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 107, 53, 0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #FF6B35, #FF8E53)',
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                }}
              >
                <LockIcon sx={{ color: 'white', fontSize: 30 }} />
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
                Sign in to your account to continue
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity={error.includes('successful') ? 'success' : 'error'} 
                sx={{ 
                  mb: 3,
                  background: error.includes('successful') 
                    ? 'linear-gradient(145deg, #1a2a1a, #0f1a0f)'
                    : 'linear-gradient(145deg, #2a1a1a, #1a0f0f)',
                  border: `1px solid ${error.includes('successful') ? '#4CAF50' : '#f44336'}`,
                  color: 'white',
                  '& .MuiAlert-icon': {
                    color: error.includes('successful') ? '#4CAF50' : '#f44336'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Email Field */}
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ color: '#FF6B35', mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: '#444',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#FF6B35',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF6B35',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#b0b0b0',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#FF6B35',
                    }
                  }}
                />

                {/* Password Field */}
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <LockIcon sx={{ color: '#FF6B35', mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: '#444',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#FF6B35',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF6B35',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#b0b0b0',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#FF6B35',
                    }
                  }}
                />

                {/* Login Button */}
                <UrbanButton
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ 
                    py: 1.5,
                    mt: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Sign In'
                  )}
                </UrbanButton>
              </Box>
            </form>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid #333' }}>
              <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                Don't have an account?
              </Typography>
              <UrbanOutlineButton
                component={Link}
                to="/register"
                fullWidth
                startIcon={<PersonIcon />}
                sx={{ 
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                Create New Account
              </UrbanOutlineButton>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Secure access to your event dashboard
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}