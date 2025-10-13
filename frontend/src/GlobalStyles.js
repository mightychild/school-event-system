import { GlobalStyles as MuiGlobalStyles } from '@mui/material';
import { deepOrange } from '@mui/material/colors';

const GlobalStyles = () => (
  <MuiGlobalStyles
    styles={{
      '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0
      },
      html: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        height: '100%',
        width: '100%'
      },
      body: {
        height: '100%',
        width: '100%',
        background: 'radial-gradient(circle at 10% 20%, #1E1E1E 0%, #121212 90%)',
        color: '#FFFFFF'
      },
      '#root': {
        height: '100%',
        width: '100%'
      },
      // Urban-inspired scrollbar
      '::-webkit-scrollbar': {
        width: '8px'
      },
      '::-webkit-scrollbar-track': {
        background: '#1E1E1E'
      },
      '::-webkit-scrollbar-thumb': {
        background: deepOrange[500],
        borderRadius: '4px'
      },
      // Pulse animation for interactive elements
      '@keyframes pulse': {
        '0%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.05)' },
        '100%': { transform: 'scale(1)' }
      }
    }}
  />
);

export default GlobalStyles;