import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DashboardLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default DashboardLayout;