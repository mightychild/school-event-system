import { styled } from '@mui/material/styles';

const UrbanContainer = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '1600px',
  margin: '0 auto',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 4)
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(0, 6)
  }
}));

export default UrbanContainer;