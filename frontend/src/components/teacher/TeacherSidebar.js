import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  Divider,
  Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/teacher' },
  { text: 'My Events', icon: <EventIcon />, path: '/teacher/events' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/teacher/analytics' },
  { text: 'Attendees', icon: <PeopleIcon />, path: '/teacher/attendees' }
];

const TeacherSidebar = ({ activeTab, setActiveTab, mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleMenuItemClick = (path) => {
    setActiveTab(path.split('/').pop() || 'dashboard');
    navigate(path);
    if (mobileOpen) {
      onMobileClose();
    }
  };

  const drawer = (
    <Box sx={{ 
      width: drawerWidth,
      height: '100vh',
      overflow: 'auto',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
      color: 'white'
    }}>
      <Box sx={{ p: 3, textAlign: 'center', marginTop: 10 }}>
        <Avatar 
          sx={{ 
            width: 64, 
            height: 64, 
            mx: 'auto', 
            mb: 2,
            background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        >
          {user?.name?.charAt(0) || 'T'}
        </Avatar>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
          }}
        >
          TEACHER DASHBOARD
        </Typography>
        <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 1 }}>
          {user?.name || 'Teacher'}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#333' }} />

      <List sx={{ px: 2, mt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => handleMenuItemClick(item.path)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #E55A2B, #E57A43)'
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    border: '1px solid rgba(255, 107, 53, 0.3)'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? 'white' : '#FF6B35',
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? 'white' : '#b0b0b0'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { md: drawerWidth }, 
        flexShrink: { md: 0 } 
      }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ 
          keepMounted: true,
          BackdropProps: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }
          }
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            position: 'fixed',
            height: '100vh',
            top: 0,
            left: 0,
            zIndex: 1200,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default TeacherSidebar;