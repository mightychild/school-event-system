import { createTheme } from '@mui/material/styles';
import { grey, deepOrange, teal } from '@mui/material/colors';

const urbanTheme = createTheme({
  palette: {
    mode: 'dark', // Urban style looks best in dark mode
    primary: {
      main: deepOrange[500], // Vibrant accent color
      contrastText: '#fff'
    },
    secondary: {
      main: teal.A400, // Complementary accent
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: grey[400],
    },
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.5px'
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.25px'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${deepOrange[700]} 100%)`,
          color: 'white !important',
          boxShadow: `0 4px 15px ${deepOrange[700]}40`,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px',
          fontWeight: 'bold',
          textTransform: 'none',
          padding: '8px 16px',
          minWidth: '80px',
          border: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: `linear-gradient(45deg, ${deepOrange[600]} 0%, ${deepOrange[800]} 100%)`,
            boxShadow: `0 6px 20px ${deepOrange[700]}60`,
            transform: 'translateY(-2px)',
            color: 'white !important'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
            transform: 'translateX(-100%)',
            transition: 'transform 0.6s ease'
          },
          '&:hover::after': {
            transform: 'translateX(100%)'
          },
          '&.Mui-disabled': {
            background: 'linear-gradient(45deg, #757575, #9e9e9e)',
            boxShadow: 'none',
            color: '#ccc !important'
          }
        })
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          background: 'linear-gradient(145deg, #232323, #1e1e1e)',
          boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #2a2a2a',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '12px 12px 24px #0a0a0a, -12px -12px 24px #2a2a2a'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: grey[700]
            },
            '&:hover fieldset': {
              borderColor: grey[500]
            }
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #1E1E1E, #121212)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }
      }
    }
  }
});

export default urbanTheme;