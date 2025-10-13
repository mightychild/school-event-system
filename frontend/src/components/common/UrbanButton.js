import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { deepOrange } from '@mui/material/colors';

const UrbanButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${deepOrange[700]} 100%)`,
  color: 'white !important',
  boxShadow: `0 4px 15px ${deepOrange[700]}40`,
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '12px',
  fontWeight: 'bold',
  textTransform: 'none',
  padding: '12px 24px',
  minWidth: '120px',
  border: 'none',
  fontSize: '1rem',
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
    color: '#ccc !important',
    transform: 'none'
  }
}));

export default UrbanButton;