import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton
} from '@mui/material';
import {
  Logout,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UrbanButton from '../common/UrbanButton';

const TeacherHeader = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        borderBottom: '1px solid #333',
        boxShadow: '0 2px 20px rgba(255, 107, 53, 0.1)'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white', fontWeight: 'bold' }}>
          Teacher Portal
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            width: 36, 
            height: 36,
            background: 'linear-gradient(45deg, #FF6B35, #FF8E53)'
          }}>
            {user?.name?.charAt(0) || 'T'}
          </Avatar>
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, color: 'white' }}>
            {user?.name}
          </Typography>
          <UrbanButton
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Logout
          </UrbanButton>
          <IconButton 
            color="inherit" 
            onClick={handleLogout}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            <Logout />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TeacherHeader;