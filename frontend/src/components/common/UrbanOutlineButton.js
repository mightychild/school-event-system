import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { deepOrange } from '@mui/material/colors';

export const UrbanOutlineButton = styled(Button)(({ theme }) => ({
  border: `2px solid ${deepOrange[700]} !important`,
  color: `${deepOrange[700]} !important`,
  background: 'transparent !important',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '8px',
  fontWeight: 'bold',
  textTransform: 'none',
  padding: '6px 16px',
  minWidth: '80px',
  '&:hover': {
    background: `linear-gradient(45deg, ${deepOrange[700]}20, ${deepOrange[800]}20) !important`,
    border: `2px solid ${deepOrange[600]} !important`,
    color: `${deepOrange[600]} !important`,
    transform: 'translateY(-1px)'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, transparent, rgba(255, 107, 53, 0.1), transparent)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.6s ease'
  },
  '&:hover::after': {
    transform: 'translateX(100%)'
  },
  '&.Mui-disabled': {
    border: `2px solid #666 !important`,
    color: '#666 !important',
    background: 'transparent !important'
  }
}));