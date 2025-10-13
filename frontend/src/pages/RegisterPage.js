import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
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
  Person as PersonIcon,
  HowToReg as HowToRegIcon
} from '@mui/icons-material';
import { authApi } from '../api/authApi';
import UrbanButton from '../components/common/UrbanButton';
import { UrbanOutlineButton } from '../components/common/UrbanOutlineButton';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      // Redirect to login page with success message
      navigate('/login?registered=true');
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response?.status === 400) {
        setError(err.response.data.error || 'Registration failed');
      } else if (err.response?.status === 409) {
        setError('User already exists with this email');
      } else if (err.message === 'Network Error') {
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        setError('Registration failed. Please try again.');
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
        background: 'radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.05) 0%, transparent 50%)',
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
                <HowToRegIcon sx={{ color: 'white', fontSize: 30 }} />
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
                Create Account
              </Typography>
              <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
                Sign up for a new account to get started
              </Typography>
            </Box>

            {error && (
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
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Name Field */}
                <TextField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="name"
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ color: '#FF6B35', mr: 1 }} />
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

                {/* Email Field */}
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  helperText="Password must be at least 6 characters"
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
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#666'
                    }
                  }}
                />

                {/* Confirm Password Field */}
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="new-password"
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

                {/* Register Button */}
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
                    'Create Account'
                  )}
                </UrbanButton>
              </Box>
            </form>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid #333' }}>
              <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                Already have an account?
              </Typography>
              <UrbanOutlineButton
                component={Link}
                to="/login"
                fullWidth
                startIcon={<PersonIcon />}
                sx={{ 
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                Sign In to Your Account
              </UrbanOutlineButton>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Join our event community today
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}